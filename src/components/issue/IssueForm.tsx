import { useState } from "react"

import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"

import { Issue } from "../../types"
import { FaSave, FaTrash } from "react-icons/fa"
import { UseMutationResult } from "@tanstack/react-query"
import Spinner from "react-bootstrap/esm/Spinner"

interface IssueFormProps {
  issue: Issue
  mutation: UseMutationResult<
    Issue,
    Error,
    {
      issue: Issue
      method: string
    },
    unknown
  >
}

const IssueForm = ({ issue, mutation }: IssueFormProps) => {
  const [subject, setSubject] = useState(issue.subject)
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value)
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const method = issue.id ? "PUT" : "POST"
    mutation.mutate({
      issue: { ...issue, subject },
      method,
    })
  }
  const handleDelete = () => {
    mutation.mutate({
      issue,
      method: "DELETE",
    })
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Card>
        <Card.Header>Issue</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Issue Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={subject}
              onChange={handleSubjectChange}
            />
            <Form.Text className="text-muted">
              Enter the subject of the issue
            </Form.Text>
          </Form.Group>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" type="submit">
            {issue.id ? (
              <>{mutation.isPending ? <Spinner /> : <FaSave />} Update</>
            ) : (
              <>{mutation.isPending ? <Spinner /> : <FaSave />} Create</>
            )}
          </Button>
          {issue.id ? (
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

export default IssueForm
