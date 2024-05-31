import { app } from '@/app';
import { register } from './register';


export async function registerRoutes() {
app.post('/register', register )
}