import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";


// backend untuk ambil data (tampilkan data)
export const getProducts = async (req, res)=> {
    try {
        const response = await Product.findAll(); // ambil semua data dari tb
        res.json(response); // parsing hasilnya
    } catch (error) {
        console.log(error.message);
    }
}

// backend untuk ambil data (tampilkan data) berdasrkan idnya
export const getProductById = async (req, res)=> {
    try {
        const response = await Product.findOne({
            where:{
                id : req.params.id // ambil id dari request params yang dikirimkan
            }
        });
        res.json(response); // parsing hasilnya
    } catch (error) {
        console.log(error.message);
    }
}

// backend untuk simpan data 
export const saveProduct = (req, res)=> {

    // jika tidak ada file yang dipilih tampilkan error 400
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});

    const name = req.body.title; // ambil namanya
    const file = req.files.file; // ambil dari body file yang dikirmkan
    const fileSize = file.data.length; // ambil ukuran imagenya
    const ext = path.extname(file.name); // ambil ekstensi imagenya
    const fileName = file.md5 + ext; // hash nama imagenya dengan md5
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`; // ambil/buat urlnya
    const allowedType = ['.png', '.jpg', '.jpeg']; // ekstensi yang diizinkan

    // tampilkan error 422 jika image yang dipilih tidak sesuai allowedType
    if(!allowedType.includes(ext.toLocaleLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    // tampilkan error 422 jika image yang dipilih sizenya lebih besar dari 2MB
    if(fileSize>2000000) return res.status(422).json({msg: "Image must be less than 2 MB"});

    // pindahkan images yang dipilih ke path yang diinginkan
    file.mv(`./public/images/${fileName}`, async(err)=>{
        // tampilkan error jika ada kesalahan
        if(err) return res.status(500).json({msg: err.message});
        try {
            // masukan data dari form input ke tb
            await Product.create({name: name, image: fileName, url: url});
            // tampilkan pesan berhasil
            res.status(201).json({msg: "Product created successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    });

}

// backend untuk update data 
export const updateProduct = async (req, res)=> {
    const product = await Product.findOne({
        where:{
            id : req.params.id // ambil id dari request params yang dikirimkan
        }
    }); 
    // jika tidak ada product berdasarkan idnya, tampilkan error
    if(!product) return res.status(404).json({msg: "No data found"});

    let fileName = "";
    let url = "";
    // cek apakah user input image baru, jika tidak
    if(req.files === null){
        // variabel fileName dan url diisi dari data dari tb sebelumnya
        fileName = Product.image;
        url = Product.url;
    }else{ // jika user input image baru
        const file = req.files.file; // ambil dari body file yang dikirmkan
        const fileSize = file.data.length; // ambil ukuran imagenya
        const ext = path.extname(file.name); // ambil ekstensi imagenya
        fileName = file.md5 + ext; // hash nama imagenya dengan md5
        const allowedType = ['.png', '.jpg', '.jpeg']; // ekstensi yang diizinkan

        // tampilkan error 422 jika image yang dipilih tidak sesuai allowedType
        if(!allowedType.includes(ext.toLocaleLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        // tampilkan error 422 jika image yang dipilih sizenya lebih besar dari 2MB
        if(fileSize>2000000) return res.status(422).json({msg: "Image must be less than 2 MB"});

        const filepath = `./public/images/${product.image}`; // ambil urlnya
        fs.unlinkSync(filepath); // hapus image lama dari folder public/images

        // pindahkan images yang dipilih ke path yang diinginkan
        file.mv(`./public/images/${fileName}`, (err)=>{
            // tampilkan error jika ada kesalahan
            if(err) return res.status(500).json({msg: err.message});
        });

        url = `${req.protocol}://${req.get("host")}/images/${fileName}`; // ambil/buat urlnya

    }

    const name = req.body.title; // ambil data name baru (yang baru diinput)
    // const url = `${req.protocol}://${req.get("host")}/images/${fileName}`; // ambil/buat urlnya
    
    // simpan ke tb
    try {
        // update data baru sesuai dengan id datanya
        await Product.update({name: name, image: fileName, url: url}, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product updated successfully"});
    } catch (error) {
        console.log(error.message);
    }

}

// backend untuk delete data 
export const deleteProduct = async (req, res)=> {
    const product = await Product.findOne({
        where:{
            id : req.params.id // ambil id dari request params yang dikirimkan
        }
    }); 
    // jika tidak ada product berdasarkan idnya, tampilkan error
    if(!product) return res.status(404).json({msg: "No data found"});

    try {
        const filepath = `./public/images/${product.image}`; // ambil urlnya
        fs.unlinkSync(filepath); // hapus imagenya dari folder public/images
        // hapus datanya dari tb berdasarkan dari id request params yang dikirimkan
        await Product.destroy({ 
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Product deleted succesfully"}); // tampilkan pesannya
    } catch (error) {
        console.log(error.message);
    }
}