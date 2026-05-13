import express from 'express';
import { Resend } from 'resend';
import { supabase } from '../config/supabase.js';

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  console.log('📧 Email received:', email);

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const { error } = await supabase
    .from('subscribers')
    .insert([{ email }]);

  if (error) {
    console.error('❌ Supabase error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Already subscribed!' });
    }
    return res.status(500).json({ message: 'Database error' });
  }

  try {
    await resend.emails.send({
      from: 'PLAN.IN <onboarding@resend.dev>',  
      to: email,                                  
      subject: 'You\'re subscribed to PLAN.IN!', 
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
          <h2>Welcome to PLAN.IN!</h2>
          <p>Thanks for subscribing. You'll get the latest updates!</p>
        </div>
      `,
    });
    console.log('✅ Email sent!');
  } catch (mailError) {
    console.error('❌ Resend error:', mailError.message);
  }

  res.json({ success: true });
});

export default router;