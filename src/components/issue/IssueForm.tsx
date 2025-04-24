import { useState } from "react"
import { UseMutationResult } from "@tanstack/react-query"

import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import { FaSave, FaTrash } from "react-icons/fa"

import { Category, Issue, Tracker } from "../../types"

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
  const [subject, setSubject] = useState<string>(issue.subject)
  const [description, setDescription] = useState<string>(issue.description)
  const [status, setStatus] = useState<string>(issue.status || "")
  const [tracker_id, setTrackerId] = useState<number>(issue.tracker_id || 0)
  const [category_id, setCategoryId] = useState<number>(issue.category_id || 0)

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value)
  }
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value)
  }
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value)
  }
  const handleTrackerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTrackerId(parseInt(e.target.value))
  }
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(parseInt(e.target.value))
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
          <Container>
            <Row>
              <Col>
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
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicDescription">
                  <Form.Label>Issue Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter issue description"
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                  <Form.Text className="text-muted">
                    Enter the description of the issue
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {trackers && (
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3" controlId="formBasicTracker">
                    <Form.Label>Tracker</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      value={issue.tracker_id}
                      onChange={handleTrackerChange}
                    >
                      <option value="" disabled={!!issue.tracker_id}>
                        Select a tracker
                      </option>
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
                </Col>
              )}
              {categories && (
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3" controlId="formBasicCategory">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      value={issue.category_id}
                      onChange={handleCategoryChange}
                    >
                      <option value="" disabled={!!issue.category_id}>
                        Select a category
                      </option>
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
                </Col>
              )}
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3" controlId="formBasicStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter issue status"
                    value={status}
                    onChange={handleStatusChange}
                  />
                  <Form.Text className="text-muted">
                    Enter the status of the issue
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Card.Body>
        <Card.Footer>
          <Button
            variant="primary"
            type="submit"
            disabled={
              mutation.isPending ||
              subject === "" ||
              description === "" ||
              tracker_id === 0
            }
          >
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
