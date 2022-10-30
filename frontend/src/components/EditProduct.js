import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState("");
    const {id} = useParams();
    const navigate = useNavigate();

    // fungsi yang akan dijalankan diawal load halaman
    useEffect(()=>{
        getProductById();
    },[])


    // fungsi untuk ambil data dari tb berdasarkan idnya
    const getProductById = async() => {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        setTitle(response.data.name);
        setFile(response.data.image);
        setPreview(response.data.url);
    }

    // fungsi loadImage
    const loadImage = (e) => {
        const image = e.target.files[0]; // ambil data imagenya
        setFile(image); // ubah state filenya dengan image yang dipilih
        setPreview(URL.createObjectURL(image)); // tangkap file/image yang dipilih untuk dipreview
    };

    // fungsi updateProduct
    const updateProduct = async(e) => {
        e.preventDefault(); // agar tidak reload halaman
        const formData = new FormData();
        formData.append("file", file); // "file" dari backend, file dari state disini
        formData.append("title", title); // "title" dari backend, file dari state disini
        try {
            // simpan data dengan api ke tb
            await axios.patch(`http://localhost:5000/products/${id}`, formData, {
                headers:{
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("/"); // redirect ke home
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <div className="columns is-centered mt-5">
        <div className="column is-half">
            <form onSubmit={updateProduct}>
                <div className="field">
                    <label className="label">Product Name</label>
                    <div className="control">
                        <input type="text" className="input" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Product Name" />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Image</label>
                    <div className="control">
                        <div className="file">
                            <label className="file-label">
                                <input type="file" className="file-input" onChange={loadImage} />
                                <span className="file-cta">
                                    <span className="file-label">Choose a file...</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* preview */}
                {/* tampilkan gambar jika ada nilai di privew, jika tidak ada kosong */}
                {preview ? (
                    <figure className="image is-128x128">
                        <img src={preview} alt="Preview Image" />
                    </figure>
                ):(
                    ""
                )}

                <div className="field">
                    <div className="control">
                        <button type="submit" className="button is-success mt-3">Update</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default EditProduct;