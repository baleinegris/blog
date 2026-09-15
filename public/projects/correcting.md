# Correcting Mode Collapse in Silicon Sampling with Semantic Similarity Rating
Oscar Heath, Rohan Alexander
August 19, 2026

# Introduction

In 2013, the National Academy of Sciences reported declining rates over
the two previous decades (National Research Council 2013). Response
rates to household surveys have been consistently declining, with the
U.S. Current Population Survey reaching historically low response rates
in November 2025 (Brookings 2026). As response rates decline, the
effectiveness of random sampling has increasingly come into question,
and researchers have turned to new methods such as sophisticated
re-weighting approaches, opt-in surveys, and online panels.

Researchers have recently found that LLMs can be conditioned via prompts
to simulate human survey responses, which can be quite accurate. This
process, coined “Silicon Sampling” by Argyle et al. (2023), allows data
to be generated for a trivial cost in a fraction of the time compared
with obtaining responses from human participants. This emergent property
of LLMs has been studied in various fields like political science
(Argyle et al. 2023), psychology (Dillion et al. 2023), and economics
(Horton et al. 2026). In general, their findings show that LLM responses
are very similar to human responses. In the private sector, companies
are beginning to make use of synthetic customers for market research,
and companies selling synthetic data and personas are emerging (The New
York Times 2026a; Bain and Company 2026).

Despite the growing adoption of silicon sampling, the degree to which it
can be trusted remains unclear. One concern that has arisen in multiple
studies is the prevalence of mode collapse, a phenomenon where the model
generates responses that are overly concentrated around the mode of the
true distribution. This causes misleading results: synthetic means are
quite close to the true means, but analysing the entire distribution
shows unrealistically low variance (Bisbee et al. 2024; Kaiser et al.
2025; Barrie and Cerina 2026). This significantly impacts downstream
analyses, leading to overconfident estimates, narrow confidence
intervals, and incorrect power calculations. Additionally, silicon
samples are affected by minor prompt changes, as well as choice and
version of model (Alexander and Collins 2026; Schröder et al. 2025;
Bisbee et al. 2024).

In this paper, we revisit the analysis of Bisbee et al. (2024), aiming
to correct mode collapse. We generate samples of thermometer scores, a
0-100 survey measure of respondent’s feelings on a given topic. We
compare two methods of generating silicon samples. In the first, we
directly prompt the model for numeric output — the approach used by
Bisbee et al. (2024), as well as many other silicon sampling studies. In
the second, we apply Semantic Similarity Rating (SSR) (Maier et al.
2025): instead of prompting LLMs for numeric scores, we generate purely
text responses, then map these responses to a thermometer scale using
text embeddings. We hypothesize that this method is better suited for
silicon sampling, as LLMs are predominantly trained to generate text. We
measure the fidelity of the synthetic distributions using the
Kullback-Leibler (KL) divergence compared to the true distribution,
which is a measure of how well the synthetic distribution approximates
the real distribution. Additionally, we compare the absolute error of
synthetic means to the true means, by respondent group and target group.

We find that applying SSR to text outputs produces synthetic response
distributions that are much closer to real ANES (American National
Election Studies 2016) distributions, with lower KL divergence, and no
significant loss in accuracy of the synthetic means. The issue of low
variance seems effectively addressed by applying SSR with a global
temperature parameter. This is a single learned parameter that controls
the variance of the generated distributions. We found no noticeable
degradation in performance when applying the temperature parameter
learned on 2016 ANES data to 2020 ANES data, suggesting that the
parameter generalizes well to future data. However, some limitations
remain: while SSR improves the variance of synthetic response
distributions the means of synthetic distributions (both from numeric
responses and SSR) are still consistently biased, in some cases,
relative to real data, just as Bisbee et al. (2024) found.

The remainder of the paper is structured as follows: In
<a href="#sec-background" class="quarto-xref">Section 2</a>, we review
related work in silicon sampling and machine learning calibration, and
situate our contributions to the field. In
<a href="#sec-methods" class="quarto-xref">Section 3</a>, we describe
our experiment design, including how we generate silicon samples, apply
SSR, and calibrate temperature parameters. In
<a href="#sec-results" class="quarto-xref">Section 4</a>, we present the
results of our analysis. Finally, in
<a href="#sec-discussion" class="quarto-xref">Section 5</a>, we discuss
the implications of our findings, limitations of our study, and
directions for future research.

# Background

LLMs have been widely applied in political science, with encouraging
results. For instance, Le Mens and Gallego (2025) use LLMs for
positioning political texts along various ideological axes, which
achieves over 0.9 correlation with human expert ratings. Benoit et al.
(2026) use LLMs to extract policy positions from political manifestos
and long texts, also correlating highly with expert ratings. Argyle et
al. (2023) found that LLMs prompted with personas generate mean
responses to American National Election Survey (ANES) questions that are
very close to true responses. Motivated by these findings, researchers
in the field of silicon sampling have experimented with using LLMs to
generate synthetic survey responses. Park et al. (2026) even proposes a
framework for LLMs as “general-purpose simulation of individuals” (Park
et al. 2026, 1).

In the midst of this growing body of research in silicon sampling, many
researchers have also pointed out shortcomings of LLM-generated data.
Our research builds on Bisbee et al. (2024), whose critical analysis of
silicon sampling found that LLMs generate synthetic responses with
unrealistically low variance compared to real data. This prohibits
researchers from performing downstream quantitative analyses on silicon
data. Bisbee et al. (2024) uses OpenAI’s ChatGPT 3.5 Turbo and ChatGPT
4.0 out-of-the-box, directly prompting the model to generate numeric
responses to thermometer questions. We argue that this method of
prompting may not be optimal for generating synthetic responses that
reflect the underlying distribution of real responses, and that
alternative methods of prompting and post-processing may improve the
fidelity of silicon sampling.

Fundamentally, silicon sampling aims to generate responses that reflect
the underlying distribution of real responses. Theoretically, this is
made possible by the fact that LLMs are trained on such large amounts of
data that they have learned these distributions. Yet, even when given
perfect information about a statistical distribution, for instance, a
standard Normal distribution, LLMs are not able to accurately generate
random samples from this distribution without the use of external tools
(Zhao et al. 2026).

Hence, we hypothesize that common failures of LLMs in silicon sampling,
such as low variance, may not be due to a misunderstanding of underlying
response distributions, but rather due to an inability to generate
samples that reflect said distribution. Fundamentally, LLMs are
probabilistic models trained to predict the next token in a sequence,
and excel at generating natural language text. Instead of prompting the
model to directly generate a numeric response, we employ Semantic
Similarity Rating (SSR), a method that solicits text-only responses from
LLMs, then maps this output to a probability distribution over a 0-100
scale using text embeddings and cosine similarity to predefined anchor
points on that scale (Maier et al. 2025). This approach has two
benefits: first, it plays to one of the main strengths of LLMs, which is
generating natural language text, rather than numeric responses. Second,
it allows us to generate a full probability distribution over the
response scale for each sample, rather than a single point estimate. SSR
has been used for simulating buyer intent and ratings (Maier et al.
2025; Pichardo 2026), outperforming other methods of generating numeric
responses. In this paper, we systematically study its application to
silicon sampling for political science research.

Other methods of improving algorithmic fidelity have been proposed and
also present promising avenues of research. Cao et al. (2025) and Suh et
al. (2026) use fine-tuning to train LLMs on past data, finding strong
performance gains. However, this approach is constraining in multiple
ways: it requires access to model weights (which is often impossible for
frontier LLMs), large amounts of training data, and significant
computational resources. Chapala et al. (2025) found that
“psychologically grounded prompt wording” can mitigate social
desirability bias in silicon sampling, and pull LLM response
distributions closer to real responses on the ANES survey. Nevertheless,
this approach is limited in that it requires manual prompt engineering,
and Chapala et al. (2025) found inconsistent results among different
models and sample questions. In contrast, SSR offers a simple
training-free approach to improving fidelity, requiring less manual
prompt engineering than Chapala et al. (2025), or access to model
weights.

# Methods

We chose to make silicon samples of thermometer scores, a common survey
instrument where respondents are asked to rate their feelings toward a
certain target group between 0 and 100. We generate synthetic
thermometer scores for respondents of the 2016 ANES survey, for four
target groups: Democratic Party, Republican Party, Liberals, and
Conservatives. For each real respondent, we create a persona prompt,
which is a text description of the respondent’s demographic and
political characteristics, which is passed into various frontier LLMs as
a prompt. For each persona, we generate two types of responses:

1.  **Numeric response**: we directly prompt the model to generate a
    numeric response between 0 and 100.

2.  **SSR response**: we prompt the model to generate a text response
    describing its feelings toward the target group. We then map this
    text response to a probability distribution over the thermometer
    scale using SSR.

The SSR process has a single learned parameter $\mathcal{T}$, which
controls the variance of the generated distribution. We learn this
parameter by choosing the value that minimizes the Kullback-Leibler (KL)
divergence between the real and synthetic distributions for 2016 ANES
data across all groups and questions. KL divergence measures how well
the synthetic distribution approximates the real distribution, with
lower values indicating a better match. We then apply this parameter to
2020 ANES data, to test whether it generalizes to future data.

A high level overview of the numeric and SSR silicon sampling processes
is shown in <a href="#fig-ssr" class="quarto-xref">Figure 1</a>.

<div id="fig-ssr">

![](./ssr-diagram.png)

Figure 1: Overview of numeric and SSR silicon sampling processes

</div>

## Data

We use data from the reproducibility package of Bisbee et al. (2024),
which contains their samples from the 2016 ANES Time Series Study
(American National Election Studies 2016) and their prompts.
Additionally, we use the 2020 ANES Time Series Study as a test set
(American National Election Studies 2020).

## Prompting

To generate personas, we used the same prompts as Bisbee et al. (2024),
which have the following format:

<center>

“It is \[`YEAR`\]. You are a \[`AGE`\] year-old, \[`MARST`\],
\[`RACETH`\] \[`GENDER`\] with \[`EDUCATION`\] making \[`INCOME`\] per
year, living in the United States. You are \[`IDEO`\], \[`REGIS`\]
\[`PID`\] who \[`INTEREST`\] pays attention to what’s going on in
government and politics.”
</center>

Terms in square brackets are replaced with the corresponding information
from the ANES respondents (see
<a href="#sec-prompts" class="quarto-xref">Appendix 6.1</a> for variable
information). We used two variants of the prompt, one soliciting a
numeric response, and one asking the model to generate only a text
response to the thermometer question.

We generated responses using four models:
`deepseek-v4-flash`(DeepSeek-AI 2026), `claude-sonnet-5` (Anthropic
2026), `gpt-5.4-mini` (OpenAI 2026). We generated one response per
persona, for a total of 7,530 responses per prompt variant. We asked
synthetic respondents for their feelings toward the Democratic Party,
Republican Party, Liberals, and Conservatives, for a total of four
questions per respondent. For the numeric prompt, we directly prompted
the model to generate a numeric response between 0 and 100. For the text
prompt, we asked the model to generate a text response describing their
feelings toward the target group, without any mention of a numeric
scale. The prompts used for each model are as follows:

Numeric prompt:
<center>

“Responses should be given on a scale from 0 (meaning cold feelings) to
100 (meaning warm feelings). Ratings between 50 degrees and 100 degrees
mean that you feel favorable and warm toward the group. Ratings between
0 degrees and 50 degrees mean that you don’t feel favorable toward the
group and that you don’t care too much for that group. You would rate
the group at the 50 degree mark if you don’t feel particularly warm or
cold toward the group.”
</center>

Text prompt:
<center>

“The following questions ask about individuals’ feelings toward
different groups. Responses should be your genuine feelings toward each
group, not what you think is socially desirable. Please elaborate in
your answers.”
</center>

## Semantic Similarity Rating

<a href="#fig-ssr" class="quarto-xref">Figure 1</a> outlines the SSR
pipeline, which maps text responses to a probability distribution over
the thermometer scale. We pre-determine five anchor points on the
thermometer scale, to which we assign text descriptions corresponding to
their relative magnitude. For instance, the anchor for the score of 0 is
“I have a very unfavorable opinion of \[GROUP\]. I strongly dislike
\[GROUP\] and reject almost everything \[GROUP\] stands for.” (see
<a href="#sec-anchor-points" class="quarto-xref">Appendix 6.2</a> for
the full list of anchor points). We then generate text embeddings of all
anchors, as well as for each synthetic respondents’ text response to the
thermometer question. Next, we calculate cosine similarities between the
response and the anchors, passing these through normalization,
temperature-scaled softmax, and kernel density estimation to generate a
smooth probability distribution over the thermometer scale for each
response.

Given text responses and anchor points, we embed them using
`Gemini Embedding 2` (Shanbhogue et al. 2026), which generates a dense
vector representation of each text. Following Pichardo (2026), we use
asymmetric embedding: we frame this as a document retrieval problem,
embedding the anchors as documents, and the response as a query, which
empirically improves downstream similarity ratings. We choose to use
`Gemini Embedding 2` for its strong performance on the MTEB text-to-text
embedding benchmark (Muennighoff et al. 2023; Shanbhogue et al. 2026),
relative price point, and support for asymmetric embedding.

We then calculate the cosine similarity between the response embedding
$E_{response}$ and embedded anchor points $E_{anchor_i}$ on the
thermometer scale (See
<a href="#sec-anchor-points" class="quarto-xref">Appendix 6.2</a> for
details), generating a list of similarities
$S = \{s_1, s_2, s_3, s_4, s_5\}$ (see
<a href="#eq-cosine-similarity" class="quarto-xref">Equation 1</a>).

<span id="eq-cosine-similarity">
$$s_i = \frac{E_{response} \cdot E_{anchor_i}}{\|E_{response}\| \|E_{anchor_i}\|}
 \qquad(1)$$</span>

Because the global embedding space allows for representation of a wide
variety of text, the embeddings of all ANES responses end up lying very
close together (~0.1 distance). Hence, we apply normalization to the
cosine similarities to increase the spread of the generated
distributions, following Pichardo (2026). This is done by first
calculating the minimum and maximum similarity scores across all anchors
for a given response, and then applying min-max normalization to scale
the similarities to a 0-1 range
(<a href="#eq-normalization" class="quarto-xref">Equation 2</a>).

<span id="eq-normalization">
$$s_{i, normalized} = \frac{s_i - \min(S)}{\max(S) - \min(S)}
 \qquad(2)$$</span>

After normalization, we apply a softmax function to the normalized
similarities to scale similarities into a probability mass function,
with an additional temperature parameter $\mathcal{T}$ to control the
variance of the distribution
(<a href="#eq-softmax" class="quarto-xref">Equation 3</a>).

We empirically generated distributions for all values of $\mathcal{T}$
between 0 and 1, at increments of 0.05, finding that
$\mathcal{T} = 0.25$ minimized the mean KL divergence between the real
and synthetic distributions for 2016 ANES data across all groups and
questions. KL divergence is a measure of how well the synthetic
distribution approximates the real distribution, with lower values
indicating a better match. We use this temperature parameter for all
subsequent analyses. <span id="eq-softmax">
$$s_{i, softmax} = \frac{\exp(s_{i, normalized} / \mathcal{T})}{\sum_{j=1}^n \exp(s_{j, normalized} / \mathcal{T})}
 \qquad(3)$$</span>

Finally, given the five softmax-scaled similarities, we generate a
probability distribution over the thermometer scale. We treat the
softmax-scaled similarities as weights for each anchor point on the
thermometer scale, and generate a Gaussian kernel density estimate to
produce a smooth probability distribution $Q_t$ over the thermometer
scale.

<div id="fig-single-cell">

![](paper_files/figure-commonmark/fig-single-cell-1.png)

Figure 2: Real and synthetic thermometer response distributions for
white Republicans asked about the Democratic Party. The gray filled area
is the real ANES 2016 distribution. Lines are synthetic distributions
from each model, generated by direct numeric prompting (blue) or SSR
(red). Dashed lines indicate the mean of each distribution.

</div>

# Results

<a href="#fig-single-cell" class="quarto-xref">Figure 2</a> shows the
real and synthetic response distributions of white republican
respondents asked about the Democratic Party. Across all three models,
we find that the raw numeric output is peaked, with lower variance than
the real distribution. In contrast, SSR generated a distribution that is
much closer to the real distribution, with more variance and less
peakedness. The means of the synthetic distributions are similar to each
other, and are also similar to the mean of the real distribution. This
example illustrates the general trend in silicon sampling: while the
means of raw numeric data distributions are often close to the real
means, the overall shape of them are overly peaked, and the variance of
the real distribution is not captured. In contrast, SSR generates
distributions that are much closer to the real distributions, with more
variance and less peakedness.

<div id="fig-numeric-all-cells">

![](paper_files/figure-commonmark/fig-numeric-all-cells-1.png)

Figure 3: Real and synthetic thermometer response distributions under
direct numeric prompting, by respondent group and target group. Gray
areas are actual ANES 2016 responses and coloured lines are the three
models.

</div>

<div id="fig-ssr-all-cells">

![](paper_files/figure-commonmark/fig-ssr-all-cells-1.png)

Figure 4: Real and synthetic thermometer response distributions under
SSR, by respondent group and target group. Gray areas are real ANES 2016
responses. Coloured lines are the three models.

</div>

<a href="#fig-numeric-all-cells" class="quarto-xref">Figure 3</a> and
<a href="#fig-ssr-all-cells" class="quarto-xref">Figure 4</a> expand on
the example in
<a href="#fig-single-cell" class="quarto-xref">Figure 2</a>, comparing
the synthetic distributions across all 36 respondent-target group pairs.
We see that results are consistent across all respondent groups and
target groups. Numeric responses display mode collapse and unrealistic
variance, consistent with the findings of Bisbee et al. (2024), which
highlights the continued issue of low variance in silicon sampling.
Newer models appear to not have meaningfully improved in this regard. We
see that SSR distributions match the shape of the real distributions
much more closely, with `claude-sonnet-5` performing the best.

<div id="fig-fit-metrics">

![](paper_files/figure-commonmark/fig-fit-metrics-1.png)

Figure 5: Change in fit when moving from raw numeric prompting to SSR.
Each grey line is one respondent-group x target cell (36 per model). The
diamonds and printed values are means over cells. The top panel is the
Kullback–Leibler divergence between synthetic and real response
distributions. The bottom panel is the absolute error of the synthetic
mean.

</div>

<div id="fig-sd-calibration">

![](paper_files/figure-commonmark/fig-sd-calibration-1.png)

Figure 6: Variance calibration of silicon samples. Each point compares
the standard deviation of real ANES responses in one respondent-group x
target cell (x-axis) with the standard deviation of synthetic responses
for the same cell (y-axis). The left panel is the raw numeric output.
The right panel is SSR.

</div>

Beyond visual inspection, we quantified the improvements in the fidelity
of SSR distributions over raw numeric outputs.
<a href="#fig-fit-metrics" class="quarto-xref">Figure 5</a> shows
substantial improvements in KL divergence across all models. All models
improved in KL divergence when moving from raw numeric output to SSR,
with `claude-sonnet-5` performing the best. Meanwhile, mean absolute
error of the synthetic means remains largely unchanged when moving from
raw numeric output to SSR, with only a slight increase in error for
`gpt-5.4-mini`. This suggests that SSR improves the shape of synthetic
distributions without harming the accuracy of the synthetic means.
<a href="#fig-sd-calibration" class="quarto-xref">Figure 6</a> show that
the standard deviation of synthetic responses matches the standard
deviation of real responses much more closely under SSR than raw numeric
output, further supporting the conclusion that SSR improves the variance
of synthetic distributions.

We briefly acknowedge the concern that we fit a temperature parameter to
minimize KL divergence, then quantify improvements using KL divergence.
However, we note a couple of points. First, we only fit a single global
temperature parameter, which is applied to all respondent groups and
target groups. Hence, we are not overfitting to any particular group or
question. Another potential concern is that the temperature parameter in
the SSR process learns to simply flatten individual response
distributions, which would reduce KL divergence over the mode collpased
numeric distributions, but not truly improve the fidelity of the
synthetic distributions. To this point we would note that the fit
temperature parameter $\mathcal{T}$ was 0.2, which is quite low, and
actually generates individual distributions that are quite peaked. We
found that KL divergence grew monotonely as $\mathcal{T}$ increased,
implying that the SSR process is not simply flattening distributions to
uniform. The variance is coming from more varied text responses.

## Results on 2020 ANES Test Set

To ensure that our temperature parameter and anchor choices were not
overfit to the 2016 ANES data, we applied the same parameter,
$\mathcal{T} = 0.2$, and anchors to the 2020 ANES dataset, and analyzed
the response distributions produced by SSR. After cleaning the raw 2020
ANES data using the same procedure as Bisbee et al. (2024) we had 6630
unique personas. We made no changes to the prompting or the SSR process.

<div id="fig-ssr-all-cells-2020">

![](paper_files/figure-commonmark/fig-ssr-all-cells-2020-1.png)

Figure 7: Real and synthetic 2020 thermometer response distributions, by
respondent group and target group. Gray areas are real ANES 2020
responses. Coloured lines are SSR responses from all models using the
global temperature parameter learned on 2016 data.

</div>

<div id="tbl-kl-summary">

Table 1: Summary of mean KL divergence between real and synthetic
distributions across all respondent groups and target groups, for 2016
and 2020 ANES data. KL divergence is a measure of how well the synthetic
distribution approximates the real distribution, with lower values
indicating a better match.

<div class="cell-output-display">

<div id="jiixfacdds" style="padding-left:0px;padding-right:0px;padding-top:10px;padding-bottom:10px;overflow-x:auto;overflow-y:auto;width:auto;height:auto;">
<style>#jiixfacdds table {
  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
&#10;#jiixfacdds thead, #jiixfacdds tbody, #jiixfacdds tfoot, #jiixfacdds tr, #jiixfacdds td, #jiixfacdds th {
  border-style: none;
}
&#10;#jiixfacdds p {
  margin: 0;
  padding: 0;
}
&#10;#jiixfacdds .gt_table {
  display: table;
  border-collapse: collapse;
  line-height: normal;
  margin-left: auto;
  margin-right: auto;
  color: #333333;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  background-color: #FFFFFF;
  width: 100%;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #A8A8A8;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #A8A8A8;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
}
&#10;#jiixfacdds .gt_caption {
  padding-top: 4px;
  padding-bottom: 4px;
}
&#10;#jiixfacdds .gt_title {
  color: #333333;
  font-size: 125%;
  font-weight: initial;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom-color: #FFFFFF;
  border-bottom-width: 0;
}
&#10;#jiixfacdds .gt_subtitle {
  color: #333333;
  font-size: 85%;
  font-weight: initial;
  padding-top: 3px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-color: #FFFFFF;
  border-top-width: 0;
}
&#10;#jiixfacdds .gt_heading {
  background-color: #FFFFFF;
  text-align: center;
  border-bottom-color: #FFFFFF;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}
&#10;#jiixfacdds .gt_bottom_border {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}
&#10;#jiixfacdds .gt_col_headings {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
}
&#10;#jiixfacdds .gt_col_heading {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 6px;
  padding-left: 5px;
  padding-right: 5px;
  overflow-x: hidden;
}
&#10;#jiixfacdds .gt_column_spanner_outer {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: normal;
  text-transform: inherit;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 4px;
  padding-right: 4px;
}
&#10;#jiixfacdds .gt_column_spanner_outer:first-child {
  padding-left: 0;
}
&#10;#jiixfacdds .gt_column_spanner_outer:last-child {
  padding-right: 0;
}
&#10;#jiixfacdds .gt_column_spanner {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: bottom;
  padding-top: 5px;
  padding-bottom: 5px;
  overflow-x: hidden;
  display: inline-block;
  width: 100%;
}
&#10;#jiixfacdds .gt_spanner_row {
  border-bottom-style: hidden;
}
&#10;#jiixfacdds .gt_group_heading {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
  text-align: left;
}
&#10;#jiixfacdds .gt_empty_group_heading {
  padding: 0.5px;
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  vertical-align: middle;
}
&#10;#jiixfacdds .gt_from_md > :first-child {
  margin-top: 0;
}
&#10;#jiixfacdds .gt_from_md > :last-child {
  margin-bottom: 0;
}
&#10;#jiixfacdds .gt_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  margin: 10px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 1px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 1px;
  border-right-color: #D3D3D3;
  vertical-align: middle;
  overflow-x: hidden;
}
&#10;#jiixfacdds .gt_stub {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-right-style: solid;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#jiixfacdds .gt_stub_row_group {
  color: #333333;
  background-color: #FFFFFF;
  font-size: 100%;
  font-weight: initial;
  text-transform: inherit;
  border-right-style: solid;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
  padding-left: 5px;
  padding-right: 5px;
  vertical-align: top;
}
&#10;#jiixfacdds .gt_row_group_first td {
  border-top-width: 2px;
}
&#10;#jiixfacdds .gt_row_group_first th {
  border-top-width: 2px;
}
&#10;#jiixfacdds .gt_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#jiixfacdds .gt_first_summary_row {
  border-top-style: solid;
  border-top-color: #D3D3D3;
}
&#10;#jiixfacdds .gt_first_summary_row.thick {
  border-top-width: 2px;
}
&#10;#jiixfacdds .gt_last_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}
&#10;#jiixfacdds .gt_grand_summary_row {
  color: #333333;
  background-color: #FFFFFF;
  text-transform: inherit;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#jiixfacdds .gt_first_grand_summary_row {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-top-style: double;
  border-top-width: 6px;
  border-top-color: #D3D3D3;
}
&#10;#jiixfacdds .gt_last_grand_summary_row_top {
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom-style: double;
  border-bottom-width: 6px;
  border-bottom-color: #D3D3D3;
}
&#10;#jiixfacdds .gt_striped {
  background-color: rgba(128, 128, 128, 0.05);
}
&#10;#jiixfacdds .gt_table_body {
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #D3D3D3;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
}
&#10;#jiixfacdds .gt_footnotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}
&#10;#jiixfacdds .gt_footnote {
  margin: 0px;
  font-size: 90%;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#jiixfacdds .gt_sourcenotes {
  color: #333333;
  background-color: #FFFFFF;
  border-bottom-style: none;
  border-bottom-width: 2px;
  border-bottom-color: #D3D3D3;
  border-left-style: none;
  border-left-width: 2px;
  border-left-color: #D3D3D3;
  border-right-style: none;
  border-right-width: 2px;
  border-right-color: #D3D3D3;
}
&#10;#jiixfacdds .gt_sourcenote {
  font-size: 90%;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 5px;
  padding-right: 5px;
}
&#10;#jiixfacdds .gt_left {
  text-align: left;
}
&#10;#jiixfacdds .gt_center {
  text-align: center;
}
&#10;#jiixfacdds .gt_right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
&#10;#jiixfacdds .gt_font_normal {
  font-weight: normal;
}
&#10;#jiixfacdds .gt_font_bold {
  font-weight: bold;
}
&#10;#jiixfacdds .gt_font_italic {
  font-style: italic;
}
&#10;#jiixfacdds .gt_super {
  font-size: 65%;
}
&#10;#jiixfacdds .gt_footnote_marks {
  font-size: 75%;
  vertical-align: 0.4em;
  position: initial;
}
&#10;#jiixfacdds .gt_asterisk {
  font-size: 100%;
  vertical-align: 0;
}
&#10;#jiixfacdds .gt_indent_1 {
  text-indent: 5px;
}
&#10;#jiixfacdds .gt_indent_2 {
  text-indent: 10px;
}
&#10;#jiixfacdds .gt_indent_3 {
  text-indent: 15px;
}
&#10;#jiixfacdds .gt_indent_4 {
  text-indent: 20px;
}
&#10;#jiixfacdds .gt_indent_5 {
  text-indent: 25px;
}
&#10;#jiixfacdds .katex-display {
  display: inline-flex !important;
  margin-bottom: 0.75em !important;
}
&#10;#jiixfacdds div.Reactable > div.rt-table > div.rt-thead > div.rt-tr.rt-tr-group-header > div.rt-th-group:after {
  height: 0px !important;
}
</style>

| Calibration Method                  | DeepSeek | GPT  | Claude |
|-------------------------------------|----------|------|--------|
| Raw Numeric 2016                    | 0.61     | 1.34 | 1.97   |
| SSR 2016 with fit parameter         | 0.13     | 0.11 | 0.07   |
| SSR 2020 with parameter fit to 2016 | 0.11     | 0.07 | 0.08   |

</div>

</div>

</div>

Applying SSR with $\mathcal{T}=0.2$ to 2020 ANES data, we obtained very
similar results to the 2016 ANES data (see
<a href="#fig-ssr-all-cells-2020" class="quarto-xref">Figure 7</a>).
<a href="#tbl-kl-summary" class="quarto-xref">Table 1</a> shows that the
KL divergence between the real and SSR synthetic distributions is very
similar in 2020 as it was in 2016 when using the same global temperature
parameter. This suggests that the global temperature parameter learned
from the 2016 ANES data generalizes well to the 2020 ANES data.

# Discussion

Overall, we find that applying SSR with only one global temperature
parameter leads to substantial improvements in the fidelity of synthetic
response distributions. The issue of unrealistically low variance is
effectively mitigated by calibrating a single temperature parameter,
without harming the mean absolute error of the synthetic distributions.
The overall shape of the response distributions are also improved, as
seen in <a href="#fig-fit-metrics" class="quarto-xref">Figure 5</a>,
with the KL divergence between the real and synthetic distributions
dropping substantially in all models when applying SSR over raw numeric
output. Using the 2020 ANES data as a test set, we find that the global
temperature parameter learned from the 2016 ANES data generalizes well
to the 2020 ANES data, lying very close to the optimal global
temperature for the 2020 set.

Despite a substantial improvement in KL divergence, the SSR process does
not correct some systematic biases in the synthetic response
distributions. As noted by Bisbee et al. (2024), the LLMs tend to
produce more extreme responses than are present in the real data, and
this bias is not corrected by SSR. In both the raw numeric output as
well as in the SSR output, the ratings of synthetic Democrats on
Conservatives are noticeably lower than the ratings of real Democrats.
So, while SSR improves the overall shape of the synthetic response
distributions, we see that biases of the model are not corrected by this
process. This suggests that this bias towards extreme opinions is not
due to an issue of LLMs having difficulty generating numbers, but rather
a more fundamental issue with the LLMs themselves and their
understanding of politics and psychology.

Overall, we find that SSR is an effective method for improving the
fidelity of synthetic response distributions on political surveys,
primarily improving on the issue of low variance in LLM responses. This
simple post-processing step can be applied to thermometer-style
questions, and requires only a small calibration set of real data to
learn temperature.

LLMs are increasingly being used by the public to inform their political
opinions. The New York Times (2026b) finds that Americans are
increasingly turning to LLMs for researching political issues, in large
enough numbers that some campaign strategists are prioritizing posting
material online in formats optimized for LLMs to read. It is therefore
important to understand the biases and limitations of LLMs in their
understanding of politics. We find that SSR does not correct for
systematic biases in the LLMs responses, and further research is needed
to understand the underlying causes of these biases and how to mitigate
them.



# References

<div id="refs" class="references csl-bib-body hanging-indent">

<div id="ref-Alexander2026Simulating" class="csl-entry">

Alexander, Rohan, and Annie Collins. 2026. *Simulating Gun Control
Attitudes After the 2025 Bondi Beach Shooting Using Persona-Conditioned
LLMs*.

</div>

<div id="ref-ANES" class="csl-entry">

American National Election Studies. 2016. “ANES 2016 Time Series Study
Full Release.”
[www.electionstudies.org](https://www.electionstudies.org).

</div>

<div id="ref-ANES2020" class="csl-entry">

American National Election Studies. 2020. “ANES 2020 Time Series Study
Full Release.”
[www.electionstudies.org](https://www.electionstudies.org).

</div>

<div id="ref-ClaudeSonnet5" class="csl-entry">

Anthropic. 2026. *Introducing Claude Sonnet 5*.

</div>

<div id="ref-Argyle" class="csl-entry">

Argyle, Lisa P., Ethan C. Busby, Nancy Fulda, Joshua R. Gubler,
Christopher Rytting, and David Wingate. 2023. “Out of One, Many: Using
Language Models to Simulate Human Samples.” *Political Analysis* 31 (3):
337–51. <https://doi.org/10.1017/pan.2023.2>.

</div>

<div id="ref-BainSynthCustomers" class="csl-entry">

Bain and Company. 2026. *Synthetic Customers Earn Their Stripes*.
<https://www.bain.com/insights/synthetic-customers-earn-their-stripes/>.

</div>

<div id="ref-Barrie2026Synthetic" class="csl-entry">

Barrie, Christopher, and Roberto Cerina. 2026. *Synthetic Personas
Distort the Structure of Human Belief Systems*. SocArXiv.
[osf.io/preprints/socarxiv/n7fq8_v1](https://osf.io/preprints/socarxiv/n7fq8_v1).

</div>

<div id="ref-Benoit20206Using" class="csl-entry">

Benoit, Kenneth, Scott De Marchi, Conor Laver, Michael Laver, and
Jinshuai Ma. 2026. “Using Large Language Models to Analyze Political
Texts Through Natural Language Understanding.” *American Journal of
Political Science*, ahead of print.
https://doi.org/<https://doi.org/10.1111/ajps.70050>.

</div>

<div id="ref-Bisbee" class="csl-entry">

Bisbee, James, Joshua D. Clinton, Cassy Dorff, Brenton Kenkel, and
Jennifer M. Larson. 2024. “Synthetic Replacements for Human Survey Data?
The Perils of Large Language Models.” *Political Analysis* 32 (4):
401–16. <https://doi.org/10.1017/pan.2024.5>.

</div>

<div id="ref-Brookings" class="csl-entry">

Brookings. 2026. *Why Did People Stop Responding to Federal Economic
Surveys? What Can Be Done?*
<https://www.brookings.edu/articles/why-did-people-stop-responding-to-federal-economic-surveys-what-can-be-done/>.

</div>

<div id="ref-Cao2025Specializing" class="csl-entry">

Cao, Yong, Haijiang Liu, Arnav Arora, Isabelle Augenstein, Paul Röttger,
and Daniel Hershcovich. 2025. “Specializing Large Language Models to
Simulate Survey Response Distributions for Global Populations.” In
*Proceedings of the 2025 Conference of the Nations of the Americas
Chapter of the Association for Computational Linguistics: Human Language
Technologies (Volume 1: Long Papers)*, edited by Luis Chiruzzo, Alan
Ritter, and Lu Wang. Association for Computational Linguistics.
<https://doi.org/10.18653/v1/2025.naacl-long.162>.

</div>

<div id="ref-Chapala2025Mitigating" class="csl-entry">

Chapala, Sashank, Maksym Mironov, and Songgaojun Deng. 2025. *Mitigating
Social Desirability Bias in Random Silicon Sampling*.
<https://arxiv.org/abs/2512.22725>.

</div>

<div id="ref-DeepSeekV4" class="csl-entry">

DeepSeek-AI. 2026. *DeepSeek-V4: Towards Highly Efficient Million-Token
Context Intelligence*.

</div>

<div id="ref-Dillion" class="csl-entry">

Dillion, Danica, Niket Tandon, Yuling Gu, and Kurt Gray. 2023. “Can AI
Language Models Replace Human Participants?” *Trends in Cognitive
Sciences* 27 (7): 597–600.
https://doi.org/<https://doi.org/10.1016/j.tics.2023.04.008>.

</div>

<div id="ref-Horton" class="csl-entry">

Horton, John J., Apostolos Filippas, and Benjamin S. Manning. 2026.
*Large Language Models as Simulated Economic Agents: What Can We Learn
from Homo Silicus?* <https://arxiv.org/abs/2301.07543>.

</div>

<div id="ref-Kaiser2025Simulating" class="csl-entry">

Kaiser, Carolin, Jakob Kaiser, Vladimir Manewitsch, Lea Rau, and Rene
Schallner. 2025. “Simulating Human Opinions with Large Language Models:
Opportunities and Challenges for Personalized Survey Data Modeling.”
*Adjunct Proceedings of the 33rd ACM Conference on User Modeling,
Adaptation and Personalization* (New York, NY, USA), UMAP adjunct ’25,
82–86. <https://doi.org/10.1145/3708319.3733685>.

</div>

<div id="ref-LeMens2025Positioning" class="csl-entry">

Le Mens, Gaël, and Aina Gallego. 2025. “Positioning Political Texts with
Large Language Models by Asking and Averaging.” *Political Analysis* 33
(3): 274–82. <https://doi.org/10.1017/pan.2024.29>.

</div>

<div id="ref-Maier2025LLMs" class="csl-entry">

Maier, Benjamin F., Ulf Aslak, Luca Fiaschi, et al. 2025. *LLMs
Reproduce Human Purchase Intent via Semantic Similarity Elicitation of
Likert Ratings*. <https://arxiv.org/abs/2510.08338>.

</div>

<div id="ref-MTEB" class="csl-entry">

Muennighoff, Niklas, Nouamane Tazi, Loïc Magne, and Nils Reimers. 2023.
*MTEB: Massive Text Embedding Benchmark*.
<https://arxiv.org/abs/2210.07316>.

</div>

<div id="ref-NAP" class="csl-entry">

National Research Council. 2013. *Nonresponse in Social Science Surveys:
A Research Agenda*. Edited by Roger Tourangeau and Thomas J. Plewes. The
National Academies Press. <https://doi.org/10.17226/18293>.

</div>

<div id="ref-Gpt5.4Mini" class="csl-entry">

OpenAI. 2026. *GPT-5.4 Mini*.

</div>

<div id="ref-Park2026LLMAgents" class="csl-entry">

Park, Joon Sung, Carolyn Q. Zou, Jonne Kamphorst, et al. 2026. *LLM
Agents Grounded in Self-Reports Enable General-Purpose Simulation of
Individuals*. <https://arxiv.org/abs/2411.10109>.

</div>

<div id="ref-Pichardo2026Measuring" class="csl-entry">

Pichardo, Eduardo Vera. 2026. *Measuring Self-Rating Bias in
LLM-Generated Survey Data: A Semantic Similarity Framework for
Independent Scale Mapping*. <https://arxiv.org/abs/2602.13862>.

</div>

<div id="ref-Schroder2025LLMs" class="csl-entry">

Schröder, Sarah, Thekla Morgenroth, Ulrike Kuhl, Valerie Vaquet, and
Benjamin Paaßen. 2025. *Large Language Models Do Not Simulate Human
Psychology*. <https://arxiv.org/abs/2508.06950>.

</div>

<div id="ref-GeminiEmbedding2" class="csl-entry">

Shanbhogue, Madhuri, Zhe Li, Shanfeng Zhang, et al. 2026. *Gemini
Embedding 2: A Native Multimodal Embedding Model from Gemini*.
<https://arxiv.org/abs/2605.27295>.

</div>

<div id="ref-Suh2026Language" class="csl-entry">

Suh, Joseph, Erfan Jahanparast, Suhong Moon, Minwoo Kang, and Serina
Chang. 2026. *Language Model Fine-Tuning on Scaled Survey Data for
Predicting Distributions of Public Opinions*.
<https://arxiv.org/abs/2502.16761>.

</div>

<div id="ref-NYTPublicOpinion" class="csl-entry">

The New York Times. 2026a. *This Is What Will Ruin Public Opinion
Polling for Good*.
<https://www.nytimes.com/2026/04/06/opinion/ai-polling.html>.

</div>

<div id="ref-NYTVotes" class="csl-entry">

The New York Times. 2026b. *“Who Should i Vote for?” Voters Turn to a.i.
Before Casting Their Ballots*.
<https://www.nytimes.com/2026/07/04/us/politics/voters-ai-chatbots-elections.html>.

</div>

<div id="ref-Zhao2026LLMs" class="csl-entry">

Zhao, Minda, Yilun Du, and Mengyu Wang. 2026. *Large Language Models Are
Bad Dice Players: LLMs Struggle to Generate Random Numbers from
Statistical Distributions*. <https://arxiv.org/abs/2601.05414>.

</div>

</div>



# Appendix

## Prompt Formats (identical to Bisbee et al. (2024)):

### System Prompt:

<center>

“It is \[`YEAR`\]. You are a \[`AGE`\] year-old, \[`MARST`\],
\[`RACETH`\] \[`GENDER`\] with \[`EDUCATION`\] making \[`INCOME`\] per
year, living in the United States. You are \[`IDEO`\], \[`REGIS`\]
\[`PID`\] who \[`INTEREST`\] pays attention to what’s going on in
government and politics.”
</center>

Where the variables are inputted as follows:

- \[`YEAR`\]: 2016 or 2020
- \[`AGE`\]: age in years of ANES respondent
- \[`RACETH`\]: non-Hispanic white, non-Hispanic black, or Hispanic
- \[`GENDER`\]: male or female
- \[`MARST`\]: divorced, married, separated, single, or widowed
- \[`EDUCATION`\]: a high school diploma, some college but no degree, a
  bachelor’s degree or more
- \[`INCOME`\]: \$30k, \$50k, \$80k, \$100k, \$150k or more
- \[`IDEO`\]: an extremely liberal, a liberal, a slightly liberal, a
  moderate, a slightly conservative, a conservative, an extremely
  conservative
- \[`REGIS`\]: registered, unregistered
- \[`PID`\]: Democrat, Independent, Republican
- \[`INTEREST`\]: never, sometimes, frequently, regularly, always

### User Prompt

#### User Prompt for numeric output:

“Provide responses from this person’s perspective. Use only knowledge
about politics that they would have. Format the output as a tsv table
with the following format: group,thermometer,explanation,confidence

The following questions ask about individuals’ feelings toward different
groups. Responses should be given on a scale from 0 (meaning cold
feelings) to 100 (meaning warm feelings). Ratings between 50 degrees and
100 degrees mean that you feel favorable and warm toward the group.
Ratings between 0 degrees and 50 degrees mean that you don’t feel
favorable toward the group and that you don’t care too much for that
group. You would rate the group at the 50 degree mark if you don’t feel
particularly warm or cold toward the group.

How do you feel toward the following groups?

The Democratic Party? The Republican Party? Liberals? Conservatives? “”

#### User Prompt for text output:

“Provide responses from this person’s perspective. Use only knowledge
about politics that they would have. Format the output as a tsv table
with the following format: group,opinion,explanation

The following questions ask about individuals’ feelings toward different
groups. Responses should be your genuine feelings toward each group, not
what you think is socially desirable. Please elaborate in your answers.

How do you feel toward the following groups?

The Democratic Party? The Republican Party? Liberals? Conservatives?

## Anchor Points for Semantic Similarity Rating (SSR):

To implement SSR, we defined anchor points on the thermometer scale at
0, 25, 50, 75, and 100, with the following corresponding text
descriptions:

Anchor 0 = “I have a very unfavorable opinion of \[GROUP\]. I strongly
dislike \[GROUP\] and reject almost everything \[GROUP\] stands for.”
Anchor 25 = “On balance I lean unfavorable toward \[GROUP\]. There is
more about \[GROUP\] that I disagree with than agree with.” Anchor 50 =
“I don’t have a strong opinion of \[GROUP\] either way. I see about as
much to like as to dislike about \[GROUP\], and my feelings are
genuinely mixed.” Anchor 75 = “On balance I lean favorable toward
\[GROUP\]. There is more about \[GROUP\] that I agree with than disagree
with.” Anchor 100 = “I have a very favorable opinion of \[GROUP\]. I
strongly like \[GROUP\] and support almost everything \[GROUP\] stands
for.”
