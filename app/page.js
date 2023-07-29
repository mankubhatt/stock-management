"use client"
import Header from "@/components/Header";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [alert, setAlert] = useState("")
  const [loading, setLoading] = useState(false)
  const [dropdown, setDropdown] = useState([])
  const [loadingAction, setLoadingAction] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      const API_URL = '/api/product';
      const response = await fetch(API_URL)
      const products_list = await response.json()
      setProducts(products_list.products)
    }
    fetchProducts()
  }, [])


  const addProduct = async (e) => {
    e.preventDefault();
    const API_URL = '/api/product';
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      console.log("Product added successfully")
      setAlert("Product has been added!")
      setProductForm({})
      const response_list = await fetch(API_URL)
      const products_list = await response_list.json()
      setProducts(products_list.products)

    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }

  }

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const handleDropdown = async (e) => {
    const query_value = e.target.value
    if (!loading) {
      setLoading(true)
      setDropdown([])
      const API_URL = '/api/search?query=' + e.target.value;
      const response = await fetch(API_URL)
      const products_list = await response.json()
      setDropdown(products_list.products)
      setLoading(false)
    }
    if (!query_value){
      setDropdown([])
    }
  }

  const buttonAction = async (action, slug, initialQty) => {
    setLoadingAction(true)
    const response = await fetch('api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({action, slug, initialQty}),
    });

    // Update dropdown and products state
    // Update dropdown state
    let productIndex = products.findIndex((item) => item.slug == slug)
    let newProducts = JSON.parse(JSON.stringify(products))
    if (action == "plus"){
      newProducts[productIndex].qty = +initialQty + 1
    } else {
      newProducts[productIndex].qty = +initialQty - 1
    }
    setProducts(newProducts)
    // Update product state
    let dropdownIndex = dropdown.findIndex((item) => item.slug == slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if (action == "plus"){
      newDropdown[dropdownIndex].qty = +initialQty + 1
    } else {
      newDropdown[dropdownIndex].qty = +initialQty - 1
    }
    setDropdown(newDropdown)

    console.log(typeof initialQty)

    setLoadingAction(false)
  }

  return (
    <>
      <Header />
      {/* Add a product */}
      <div className="container mx-auto p-4 my-5">
        <div className="text-green-800 text-center">{alert}</div>
        <h1 className="text-3xl font-semibold mb-4">Add a Product</h1>
        <form className="w-full">
          <div className="mb-4">
            <label
              htmlFor="product-name"
              className="text-lg font-semibold mb-2"
            >
              Product Slug:
            </label>
            <input
              name="slug"
              value={productForm?.slug || ""}
              onChange={handleChange}
              type="text"
              id="product-name"
              className="border px-4 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="product-quantity"
              className="text-lg font-semibold mb-2"
            >
              Quantity:
            </label>
            <input
              name="qty"
              value={productForm?.qty || ""}
              onChange={handleChange}
              type="number"
              id="product-quantity"
              className="border px-4 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="product-price"
              className="text-lg font-semibold mb-2"
            >
              Price:
            </label>
            <input
              name="price"
              value={productForm?.price || ""}
              onChange={handleChange}
              type="number"
              id="product-price"
              className="border px-4 py-2 w-full"
            />
          </div>
          <button
            onClick={addProduct}
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 focus:bg-purple-700 text-white px-6 py-3 mt-4 rounded-lg transition-colors duration-300 ease-in-out"
          >
            Add Product
          </button>
        </form>
      </div>
      {/* Search a product */}
      <div className="container mx-auto p-4 my-5">
        <h1 className="text-3xl font-semibold mb-4">Search a Product</h1>
        <div className="flex items-center mb-2">
          <input
            onChange={handleDropdown}
            type="text"
            id="search-input"
            className="border px-4 py-2 w-full"
            placeholder="Enter product name"
          />
          <select className="ml-2 border px-4 py-2">
            <option value="">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            {/* Add more options for different categories */}
          </select>
        </div>
        {loading && <div className="flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="160px" height="160px">
            <g transform="rotate(0 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(30 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(60 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(90 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(120 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(150 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(180 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(210 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(240 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(270 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(300 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
              </rect>
            </g><g transform="rotate(330 50 50)">
              <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#1d0e0b">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
              </rect>
            </g>
          </svg>
        </div>
        }
        <div className="dropcontainer absolute w-[77vw] border-1 bg-purple-100 rounded-md shadow-md">
          {dropdown.map(item => (
            <div key={item.slug} className="container flex justify-between items-center p-2 my-1 border-b-2">
              <span>{item.slug} ({item.qty} available for ₹{item.price} each)</span>
              <div className="flex items-center">
                <button onClick={() => buttonAction("minus", item.slug, item.qty)} disabled={loadingAction} className="subract bg-purple-500 text-white px-2 py-1 rounded-lg mx-2 shadow-md disabled:bg-purple-200">-</button>
                <span className="qty text-purple-900 text-sm font-semibold w-8 text-center">{item.qty}</span>
                <button onClick={() => buttonAction("plus", item.slug, item.qty)} disabled={loadingAction} className="add bg-purple-500 text-white px-2 py-1 rounded-lg mx-2 shadow-md disabled:bg-purple-200">+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add other search-related components here */}
        {/* E.g., search button, filters, etc. */}
      </div>
      {/* Display current stock */}
      <div className="container mx-auto p-4 my-5">
        <h1 className="text-3xl font-semibold mb-4">Display Current Stock</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              return <tr key={product.slug}>
                <td className="border px-4 py-2">{product.slug}</td>
                <td className="border px-4 py-2">{product.qty}</td>
                <td className="border px-4 py-2">₹{product.price}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
