import { Html, Head, Body, Container, Text, Heading, Section } from '@react-email/components';
import * as React from 'react';

interface Props {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  serviceName: string;
  dateTimeStr: string;
}

export default function AdminEmail({ guestName, guestPhone, guestEmail, serviceName, dateTimeStr }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f4f4f5', fontFamily: 'sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '40px 20px', maxWidth: '600px' }}>
          <Heading style={{ color: '#18181b', fontSize: '24px' }}>🔥 Új Foglalás Érkezett!</Heading>
          
          <Section style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e4e4e7' }}>
            <Text><strong>Vendég neve:</strong> {guestName}</Text>
            <Text><strong>Telefonszám:</strong> {guestPhone}</Text>
            <Text><strong>E-mail:</strong> {guestEmail}</Text>
            <Text><strong>Szolgáltatás:</strong> {serviceName}</Text>
            <Text><strong>Időpont:</strong> {dateTimeStr}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}