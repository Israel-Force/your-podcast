import React from 'react'

import Header from "./Header"
import Footer from "./Footer"

export default function NotFound() {
 return (
  <div>
   <Header />
   <div className="notFound">
   <h1>404 NOT FOUND</h1>
   <h4>We Are Not Here</h4>
   </div>
   <Footer />
  </div>
 )
}
