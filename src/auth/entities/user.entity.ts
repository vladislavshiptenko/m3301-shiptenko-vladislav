export class User {
  constructor(id: string, name: string, email: string, role: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }

  id: string;

  name: string;

  email: string;

  role: string;
}
