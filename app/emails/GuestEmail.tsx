import { Html, Head, Body, Container, Text, Heading, Section, Hr } from '@react-email/components';
import * as React from 'react';

interface Props {
  guestName: string;
  serviceName: string;
  dateTimeStr: string;
  price: number;
}

export default function GuestEmail({ guestName, serviceName, dateTimeStr, price }: Props) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Időpont megerősítve!</Heading>
          <Text style={text}>Hello {guestName}!</Text>
          <Text style={text}>Sikeresen rögzítettük a foglalásodat az Artist Cave szalonba. Itt vannak a részletek:</Text>
          
          <Section style={card}>
            <Text style={details}><strong>Szolgáltatás:</strong> {serviceName}</Text>
            <Text style={details}><strong>Időpont:</strong> {dateTimeStr}</Text>
            <Text style={details}><strong>Várható összeg:</strong> {price.toLocaleString('hu-HU')} Ft</Text>
          </Section>
          
          <Hr style={hr} />
          <Text style={footer}>Várunk szeretettel az időpontodban!</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#09090b', fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', width: '100%', maxWidth: '600px' };
const h1 = { color: '#ffffff', fontSize: '28px', fontWeight: '900', textAlign: 'center' as const, textTransform: 'uppercase' as const, letterSpacing: '2px' };
const text = { color: '#a1a1aa', fontSize: '16px', lineHeight: '24px' };
const card = { backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '24px', margin: '32px 0', boxShadow: '0 0 20px rgba(139,92,246,0.1)' };
const details = { color: '#ffffff', fontSize: '16px', margin: '12px 0' };
const hr = { borderColor: '#27272a', margin: '32px 0' };
const footer = { color: '#71717a', fontSize: '12px', textAlign: 'center' as const, textTransform: 'uppercase' as const, letterSpacing: '1px' };