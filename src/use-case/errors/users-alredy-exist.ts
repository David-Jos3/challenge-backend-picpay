
export class UserAlredyExistsError extends Error {
  constructor(){
    super('Data already registered')
  };
}