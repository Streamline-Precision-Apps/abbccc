export default function Spinner() {
  // there is a custom class for the spinner in the tailwind config
  return (
    <div className="flex justify-center items-center ">
      <div className="animate-spin-custom rounded-full h-10 w-10 border-b-2 border-app-dark-blue"></div>
    </div>
  );
}
