import { app } from '@/app';
import { wallet } from './wallet';


export async function walletRoutes() {
app.post('/wallet', wallet  )
}