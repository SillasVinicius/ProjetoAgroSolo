import { Request, Response } from 'express';
import { User, users } from './users';
import * as jwt from 'jsonwebtoken';
export const handleAuthentication = (req: Request, resp: Response) => {
  const user: User = req.body;
  if (isValid(user)) {
    const dbUser: User = users[user.email];
    const token = jwt.sign({ sub: dbUser.email, iss: 'agroSolo-api' }, 'agroSolo-password');
    resp.json({ name: dbUser.name, email: dbUser.email, accessToken: token });
  } else {
    resp.status(303).json({ message: 'dados invalidos' });
  }
};

function isValid(user: User): boolean {
  if (!user) {
    return false;
  }

  const dbUser = users[user.email];
  return dbUser !== undefined && dbUser.matches(user);
}
