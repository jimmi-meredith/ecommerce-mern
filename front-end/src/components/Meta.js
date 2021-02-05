import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='descripttion' content={description} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to J-Shop',
  description: 'Selling the best products for cheap prices',
}

export default Meta
