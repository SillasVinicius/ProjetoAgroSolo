export class User {
  constructor(public email: string, public name: string, private password: string) {}

  matches(another: User): boolean {
    return (
      another !== undefined && another.email === this.email && another.password === this.password
    );
  }
}

export const users = {
  'sillas@gmail.com': new User('sillas@gmail.com', 'sillas', '1234'),
  'luiz@gmail.com': new User('luiz@gmail.com', 'luiz', '1234')
};
