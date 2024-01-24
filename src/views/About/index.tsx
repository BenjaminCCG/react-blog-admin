import React from 'react';
import { useMotion } from 'react-use';

function About() {
  const state = useMotion();

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
}

export default About;
