export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-600">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-10 flex flex-col items-center">
        <span className="text-6xl mb-4">🚫</span>
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-blue-800 mb-6">
          Sorry, the page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
