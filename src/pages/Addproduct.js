/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import {
  delImg,
  resetStateUpload,
  uploadImg,
} from "../features/upload/uploadSlice";
import {
  createProducts,
  getAProduct,
  resetState,
  updateAProduct,
} from "../features/product/productSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getSuppliers } from "../features/supplier/supplierSlice";

let schema = Yup.object().shape({
  title: Yup.string().required("Title cannot be empty"),
  description: Yup.string().required("Description cannot be empty"),
  price: Yup.number().required("Price cannot be empty"),
  brand: Yup.string().required("Brand cannot be empty"),
  category: Yup.string().required("Category cannot be empty"),
  tags: Yup.string().required("Tags cannot be empty"),
  color: Yup.string().required("Color cannot be empty"),
  quantity: Yup.number().required("Quantity cannot be empty"),
  size: Yup.string().required("Size cannot be empty"),
  weight: Yup.string().required("Weight cannot be empty"),
  power: Yup.string(),
  lifespan: Yup.string().required("Lifespan cannot be empty"),
  warranty: Yup.string().required("Warranty cannot be empty"),
  supplierID: Yup.string().required("Supplier ID cannot be empty"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];

  

  useEffect(() => {
    if (getProductId !== undefined) {
      dispatch(getAProduct(getProductId));
    } else {
      dispatch(resetState());
    }
  }, [getProductId]);

  useEffect(() => {
    dispatch(resetState());
    dispatch(resetStateUpload());
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
    dispatch(getSuppliers());
  }, []);

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const supplierState = useSelector((state) => state.supplier ? state.supplier.suppliers : []);
  const newProduct = useSelector((state) => state.product);
  const {
    isSuccess,
    isError,
    isLoading,
    createdProduct,
    updatedProduct,
    productName,
    productDesc,
    productPrice,
    productBrand,
    productCategory,
    productTags,
    productColor,
    productQuantity,
    productSize,
    productWeight,
    productPower,
    productLifespan,
    productWarranty,
    supplierID,
  } = newProduct;
  const { productImages } = newProduct;
  const imgState = useSelector((state) => state.upload.images);

  const deletedImageState = useSelector((state) => state.upload.deletedImage);

  // console.log("deletedImageState", deletedImageState?.deletedImageId);

  useEffect(() => {
    if (isSuccess && createdProduct) {
      setTotalImagesSaveDB([]);
      toast.success("Product added successfully!");
    }
    if (isSuccess && updatedProduct) {
      toast.success("Product updated successfully!");
      navigate("/admin/list-product");
    } else if (isError) {
      toast.error("An error occurred!");
    }
  }, [isSuccess, isError, isLoading]);

  const [totalImagesSaveDB, setTotalImagesSaveDB] = useState([]);

  const [imagesUploaded, setImagesUploaded] = useState([]);
  useEffect(() => {
    const img = [];
    imgState.forEach((i) => {
      img.push({
        public_id: i.public_id,
        url: i.url,
      });
    });
    setImagesUploaded(img);
    setTotalImagesSaveDB([...totalImagesSaveDB, ...img]);
  }, [imgState]);

  const [imagesProducted, setImagesProducted] = useState([]);
  useEffect(() => {
    const img = [];
    productImages.forEach((i) => {
      img.push({
        public_id: i.public_id,
        url: i.url,
      });
    });
    setImagesProducted(img);
    setTotalImagesSaveDB([...totalImagesSaveDB, ...img]);
  }, [productImages]);

  console.log(
    "Retrieve the loading screen from the database when there is a getProductId: ",
    productImages
  );
  console.log(
    "After handling loading images from the database when there is a getProductId: ",
    imagesProducted
  );
  console.log("Uploaded images array: ", imgState);
  console.log("After processing uploaded images: ", imagesUploaded);
  console.log("Total images to save in the database: ", totalImagesSaveDB);

  useEffect(() => {
    const imagesArr = totalImagesSaveDB.filter(
      (item) => item?.public_id !== deletedImageState?.deletedImageId
    );
    setTotalImagesSaveDB(imagesArr);
  }, [deletedImageState?.deletedImageId]);

  const onSubmit = async (values) => {
    console.log('on submit');
    values.images = totalImagesSaveDB;
    values.supplierID = supplierID;
    console.log('values are'+ values);
    try {
      if (getProductId !== undefined) {
        const data = { id: getProductId, productData: values };
        dispatch(updateAProduct(data));
      } else {
        console.log('dispactch on submit');
        dispatch(createProducts(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
          dispatch(resetStateUpload());
          dispatch(getBrands());
          dispatch(getCategories());
          dispatch(getColors());
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (e.g., display error message to the user)
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: productName || "",
      description: productDesc || "",
      price: productPrice || "",
      brand: productBrand || "",
      category: productCategory || "",
      tags: productTags || "",
      color: productColor || "",
      quantity: productQuantity || "",
      size: productSize || "",
      weight: productWeight || "",
      power: productPower || "",
      lifespan: productLifespan || "",
      warranty: productWarranty || "",
      supplierID: supplierID || "65c3d95bfd41134f9d0554db",
      images: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        // Add supplierID to the values object
        console.log('values 2 is', values);
        values.supplierID = supplierID; // Assuming supplierID is available in your component state or props
        console.log('values 2 after set is', values);
        // Dispatch createProducts action with the updated values
        await dispatch(createProducts(values));
        
        // Reset form and other actions...
      } catch (error) {
        console.error('Error creating product:', error);
        // Handle error
      }
    },
  
    // onSubmit: async (values) => {
    //   values.images = totalImagesSaveDB;
    //   try {
    //     if (getProductId !== undefined) {
    //       const data = { id: getProductId, productData: values };
    //       dispatch(updateAProduct(data));
    //     } else {
    //       await dispatch(createProducts(values));
    //       formik.resetForm();
    //       setTimeout(() => {
    //         dispatch(resetState());
    //         dispatch(resetStateUpload());
    //         dispatch(getBrands());
    //         dispatch(getCategories());
    //         dispatch(getColors());
    //       }, 2000);
    //     }
    //   } catch (error) {
    //     console.error('Error submitting form:', error);
    //     // Handle error (e.g., display error message to the user)
    //   }
    // }    
  });

  return (
    <div>
      <h3 className="mb-2 title">
        {getProductId !== undefined ? "Edit" : "Add"} Product
      </h3>
      <div>
        <form
          action=""
          onSubmit={formik.handleSubmit}
          className="d-flex flex-column gap-3"
        >
          <CustomInput
            type="text"
            label="Product Name"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
            <div className="error">
              {formik.touched.description && formik.errors.description}
            </div>
          </div>
          <CustomInput
            type="number"
            label="Price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Brand</option>
            {brandState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <select
            name="tags"
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            value={formik.values.tags}
            className="form-control py-3"
            id=""
          >
            <option value="">Choose Tags</option>
            <option value="Featured">Featured</option>
            <option value="Popular">Popular</option>
            <option value="Special">Special</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>
          <select
            name="color"
            onChange={formik.handleChange("color")}
            onBlur={formik.handleBlur("color")}
            value={formik.values.color}
            className="form-control py-3"
            id=""
          >
            <option value="">Choose Color</option>
            {colorState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title === "#ffffff"
                    ? "White"
                    : i.title === "#000000"
                    ? "Black"
                    : i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          <CustomInput
            type="number"
            label="Quantity"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          <CustomInput
            type="text"
            label="Size"
            name="size"
            onChng={formik.handleChange("size")}
            onBlr={formik.handleBlur("size")}
            val={formik.values.size}
          />
          <div className="error">
            {formik.touched.size && formik.errors.size}
          </div>
          <CustomInput
            type="text"
            label="Weight"
            name="weight"
            onChng={formik.handleChange("weight")}
            onBlr={formik.handleBlur("weight")}
            val={formik.values.weight}
          />
          <div className="error">
            {formik.touched.weight && formik.errors.weight}
          </div>
          <CustomInput
            type="text"
            label="Power (W)"
            name="power"
            onChng={formik.handleChange("power")}
            onBlr={formik.handleBlur("power")}
            val={formik.values.power}
          />
          <div className="error">
            {formik.touched.power && formik.errors.power}
          </div>
          <CustomInput
            type="text"
            label="Lifespan (years)"
            name="lifespan"
            onChng={formik.handleChange("lifespan")}
            onBlr={formik.handleBlur("lifespan")}
            val={formik.values.lifespan}
          />
          <div className="error">
            {formik.touched.lifespan && formik.errors.lifespan}
          </div>
          <CustomInput
            type="text"
            label="Warranty (Months)"
            name="warranty"
            onChng={formik.handleChange("warranty")}
            onBlr={formik.handleBlur("warranty")}
            val={formik.values.warranty}
          />
          <div className="error">
            {formik.touched.warranty && formik.errors.warranty}
          </div>
          <select
            name="supplierID"
            onChange={formik.handleChange("supplierID")}
            onBlur={formik.handleBlur("supplierID")}
            value={formik.values.supplierID}
            className="form-control py-3 mt-3 form-select"
            id=""
          >
            <option value="">Choose Supplier</option>
            {supplierState &&
              supplierState.map((supplier, index) => (
                <option key={index} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
          </select>
          <div className="showImages d-flex flex-wrap gap-4">
            {totalImagesSaveDB?.map((image, index) => (
              <div className="position-relative" key={index}>
                <button
                  type="button"
                  onClick={() => dispatch(delImg(image.public_id))}
                  className="btn-close position-absolute"
                  style={{ top: "10px", right: "10px" }}
                ></button>
                <img src={image.url} alt="" width={200} height={200} />
              </div>
            ))}
          </div>

          <div className="error">
            {formik.touched.supplierID && formik.errors.supplierID}
          </div>
          <div className="bg-white border-1 p-1 text-center">
            <Dropzone
              onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className="mb-0 p-4">
                      Select one or multiple images to upload (this may take a
                      little time)
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="showImages d-flex flex-wrap gap-4">
            {totalImagesSaveDB?.length !== 0 &&
              totalImagesSaveDB?.map((i, j) => {
                return (
                  <div className="position-relative" key={j}>
                    <button
                      type="button"
                      onClick={() => dispatch(delImg(i.public_id))}
                      className="btn-close position-absolute"
                      style={{ top: "10px", right: "10px" }}
                    ></button>
                    <img src={i.url} alt="" width={200} height={200} />
                  </div>
                );
              })}
          </div>

          <button
            className="btn btn-success border-0 rounded-3 my-3"
            type="submit"
          >
            {getProductId !== undefined ? "Edit" : "Add"} Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
