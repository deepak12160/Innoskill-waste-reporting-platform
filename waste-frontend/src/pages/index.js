import { useState, useEffect } from 'react';

export default function WasteReporting() {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reports`);
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !description) {
      alert('Please fill in location and description!');
      return;
    }
    setLoading(true);

    try {
      let imageUrl = null;

      // Convert image to base64 if selected
      if (image) {
        imageUrl = imagePreview;
      }

      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, description, image: imageUrl }),
      });

      if (response.ok) {
        alert("Report submitted successfully!");
        setLocation('');
        setDescription('');
        setImage(null);
        setImagePreview(null);
        fetchReports(); // Refresh the list
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Submission failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50/30 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
        
        {/* Header Section */}
        <div className="bg-cyan-100/50 p-4 text-center relative">
          <h1 className="text-2xl font-bold text-gray-800">Community Waste Reporting</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          
          {/* LEFT COLUMN: Submit Report */}
          <div className="p-10 border-r border-gray-200">
            <h2 className="text-lg font-bold mb-6 text-gray-700">Submit Report</h2>
            
            <div className="space-y-6">
              {/* Upload Photo Button */}
              <label className="w-full py-3 px-4 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center gap-3 text-gray-600 hover:bg-gray-200 transition cursor-pointer">
                <span className="text-2xl text-blue-500">📷</span>
                <span className="font-medium">Upload Photo</span>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative rounded-xl overflow-hidden border-2 border-blue-400 bg-white p-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Location Input */}
              <input 
                type="text"
                placeholder="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-blue-400 focus:bg-white outline-none transition"
              />

              {/* Description Box */}
              <div className="bg-gray-100 rounded-2xl p-6 min-h-[250px] relative">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Description</h3>
                <textarea 
                  placeholder="Describe The Issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-gray-600 resize-none h-40 pt-2"
                />
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-200"
              >
                {loading ? "Processing..." : "Submit Report"}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: View Reports */}
          <div className="p-10 bg-gray-50/50">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-gray-700">View Reports</h2>
              <div className="flex bg-gray-200 rounded-xl p-1">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-sm">List View</button>
                <button className="px-6 py-2 text-sm text-gray-500 font-semibold">Map View</button>
              </div>
            </div>

            {/* Dynamic Report List */}
            <div className="space-y-6 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {reports.map((report) => (
                <div key={report._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                  <div className="w-28 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    {/* Display report image or placeholder */}
                    {report.image ? (
                      <img src={report.image} alt="Report" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">No Image</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{report.location}</h4>
                    <p className="text-sm text-gray-500 mb-4">{report.description}</p>
                    <div className="flex justify-end">
                      <span className={`px-8 py-2 rounded-xl text-white text-sm font-bold ${
                        report.status === 'Resolved' ? 'bg-lime-500' : 'bg-red-600'
                      }`}>
                        {report.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}