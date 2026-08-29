import PaperCards from './PaperCards';

export default function Papers() {
    return (
        <>
        <div className="flex flex-col items-left justify-center ml-8 absolute top-[20%]">
            <h1 className="text-4xl font-bold mb-4">My Papers</h1>
            <PaperCards />
        </div>
        </>
    );
}