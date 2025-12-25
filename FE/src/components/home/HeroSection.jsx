import Searchbar from "../layout/Searchbar";

function HeroSection() {
  return (
    <div className="bg-gray-900 text-white py-40 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Việc làm tốt nhất cho bạn</h1>
      <div className="flex justify-center gap-4 mb-6">
        <Searchbar />
      </div>
    </div>
  );
}
export default HeroSection;
