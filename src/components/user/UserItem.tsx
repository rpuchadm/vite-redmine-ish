import { Link } from "react-router-dom"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import ListGroup from "react-bootstrap/ListGroup"

import { User, UserRole, Role } from "../../types"

interface UserItemProps {
  user: User
  user_roles: UserRole[]
  roles: Role[]
}

const UserItem = ({ user, user_roles, roles }: UserItemProps) => {
  const froles = roles?.filter((role) =>
    user_roles.find((ur) => ur.role_id === role.id)
  )
  return (
    <Col>
      <Card>
        <Card.Header>
          <Link to={`/user/${user.id}`}>
            <strong>{user.username}</strong>
          </Link>
        </Card.Header>
        <Card.Body>
          {user.email}
          <ListGroup>
            {froles.map((role) => (
              <ListGroup.Item key={role.id}>{role.name}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
      <br />
    </Col>
  )
}

export default UserItem
