import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1>Take home exercise</h1>
      <div className="p-4">
        <Link className="button text" href="/teams">Start</Link>
      </div>
    </div>
  );
}