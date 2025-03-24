import { useState } from "react"

import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"

import { Category } from "../../types"
import { FaSave, FaTrash } from "react-icons/fa"
import { UseMutationResult } from "@tanstack/react-query"
import Spinner from "react-bootstrap/esm/Spinner"

interface CategoryFormProps {
  category: Category
  mutation: UseMutationResult<
    Category,
    Error,
    {
      category: Category
      method: string
    },
    unknown
  >
}

const CategoryForm = ({ category, mutation }: CategoryFormProps) => {
  const [name, setName] = useState(category.name)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const method = category.id ? "PUT" : "POST"
    mutation.mutate({
      category: { ...category, name },
      method,
    })
  }
  const handleDelete = () => {
    mutation.mutate({
      category,
      method: "DELETE",
    })
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <Card.Header>Category</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={handleNameChange}
            />
            <Form.Text className="text-muted">
              Enter the name of the category
            </Form.Text>
          </Form.Group>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" type="submit">
            {category.id ? (
              <>{mutation.isPending ? <Spinner /> : <FaSave />} Update</>
            ) : (
              <>{mutation.isPending ? <Spinner /> : <FaSave />} Create</>
            )}
          </Button>
          {category.id ? (
            <Button
              variant="danger"
              onClick={handleDelete}
              className="float-end"
            >
              {mutation.isPending ? <Spinner /> : <FaTrash />} Delete
            </Button>
          ) : null}
        </Card.Footer>
      </Card>
    </Form>
  )
}

export default CategoryForm
