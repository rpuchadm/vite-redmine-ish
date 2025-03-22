import React from "react"

import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"

import Header from "./Header"

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <Container>
        <Row>
          <Col>{children}</Col>
        </Row>
      </Container>
    </>
  )
}

export default Layout
