import { NextRequest, NextResponse } from 'next/server';

type Data = {
  status: 'ok' | 'ng';
  message?: string;
  environments: {
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;
    BASIC_AUTH_USER?: string;
    BASIC_AUTH_PASSWORD?: string;
  };
};

const convert_secret = (s: string | undefined): string | undefined => {
  if (s === undefined) {
    return undefined;
  }
  return '*'.repeat(s.length);
};

export const GET = async (req: NextRequest) => {
  const environments = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: convert_secret(process.env.NEXTAUTH_SECRET),
    BASIC_AUTH_USER: process.env.BASIC_AUTH_USER,
    BASIC_AUTH_PASSWORD: convert_secret(process.env.BASIC_AUTH_PASSWORD),
  };

  const data: Data = { status: 'ok', environments: environments };
  return NextResponse.json(data);
};
