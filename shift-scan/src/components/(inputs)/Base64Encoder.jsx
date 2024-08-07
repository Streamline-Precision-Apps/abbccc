"use client";

export default function Base64Encoder() {
const [base64String, setBase64String] = useState('');

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
        setBase64String(reader.result);
    };
    reader.readAsDataURL(file);
    }
};

return (
    <div>
    <input type="file" accept="image/*" onChange={handleFileChange} />
    <button onClick={() => console.log(base64String)}>Encode Image</button>
    <p>{base64String}</p>
    </div>
);
};
