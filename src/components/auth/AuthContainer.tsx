import { useEffect, useState } from "react"

import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"
import AppConfig from "../../AppConfig"
import { FaExclamationTriangle } from "react-icons/fa"

interface AuthFormProps {
  token: string
  error: string
  isLoading: boolean
  handleToken: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (
    ev: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>
}

const AuthForm = ({
  token,
  error,
  isLoading,
  handleToken,
  handleSubmit,
}: AuthFormProps) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col>
            <h1>Unauthorized</h1>
            <p>
              In order to access this page, you need to provide a valid token.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formBasicToken">
              <Form.Label>Token</Form.Label>
              <Form.Control
                value={token}
                onChange={handleToken}
                type="text"
                placeholder="Enter token"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            {error && (
              <>
                <Alert variant="danger">
                  <FaExclamationTriangle size={25}> </FaExclamationTriangle>{" "}
                  {error}.
                </Alert>
              </>
            )}
            <Button
              variant="primary"
              type="submit"
              disabled={!token || isLoading}
              onClick={handleSubmit}
            >
              Continue
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  )
}

interface AuthContainerProps {
  children: React.ReactNode
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState<string>(
    localStorage.getItem(AppConfig.TOKEN_ITEM_NAME) || ""
  )
  const [isLoading, setIsLoading] = useState(true)
  const [refetch, setRefetch] = useState<number>(0)
  const [error, setError] = useState<string>("")
  const handleToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value)
  }
  const handleSubmit = async (
    ev: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    ev.preventDefault()
    localStorage.setItem(AppConfig.TOKEN_ITEM_NAME, token)
    setRefetch((prev) => prev + 1)
  }

  useEffect(() => {
    const fetchAuth = async () => {
      const url = AppConfig.API_BASE_URL + "auth"
      const response = await fetch(url, {
        method: "GET",
        credentials: "omit",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = (await response.json()) as { status: string; error: string }
      if (data.status === "success") {
        setToken(token)
        setIsAuthenticated(true)
      } else {
        if (isAuthenticated) {
          setIsAuthenticated(false)
        }
        if (data.error) {
          setError(data.error)
        } else {
          setError("An error occurred")
        }
        localStorage.removeItem(AppConfig.TOKEN_ITEM_NAME)
      }
      setIsLoading(false)
    }

    if (token) {
      fetchAuth()
    }
    setIsLoading(false)
  }, [refetch])

  if (isLoading) {
    return <Spinner animation="border" role="status" />
  }
  if (!isAuthenticated) {
    return (
      <>
        <AuthForm {...{ token, isLoading, error, handleToken, handleSubmit }} />
      </>
    )
  }

  return <>{children}</>
}

export default AuthContainer
