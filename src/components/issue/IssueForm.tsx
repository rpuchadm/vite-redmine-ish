import { useState } from "react"

import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"

import { Category, Issue, Tracker } from "../../types"
import { FaSave, FaTrash } from "react-icons/fa"
import { UseMutationResult } from "@tanstack/react-query"
import Spinner from "react-bootstrap/esm/Spinner"

interface IssueFormProps {
  issue: Issue
  categories?: Category[]
  trackers?: Tracker[]
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

const IssueForm = ({
  issue,
  categories,
  trackers,
  mutation,
}: IssueFormProps) => {
  const [subject, setSubject] = useState(issue.subject)
  const [category_id, setCategoryId] = useState(issue.category_id)
  const [tracker_id, setTrackerId] = useState(issue.tracker_id)
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value)
  }
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(parseInt(e.target.value))
  }
  const handleTrackerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTrackerId(parseInt(e.target.value))
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const method = issue.id ? "PUT" : "POST"
    mutation.mutate({
      issue: { ...issue, subject, category_id, tracker_id },
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
          {trackers && (
            <Form.Group className="mb-3" controlId="formBasicTracker">
              <Form.Label>Tracker</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={issue.tracker_id}
                onChange={handleTrackerChange}
              >
                {trackers?.map((tracker) => (
                  <option key={tracker.id} value={tracker.id}>
                    {tracker.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Select the tracker for the issue
              </Form.Text>
            </Form.Group>
          )}
          {categories && (
            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={issue.category_id}
                onChange={handleCategoryChange}
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Select the category for the issue
              </Form.Text>
            </Form.Group>
          )}
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
