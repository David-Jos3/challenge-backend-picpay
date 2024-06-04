import { app } from '@/app';
import { transaction } from './transation';


export async function transationRoutes() {
app.post('/transfer', transaction )
}