import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { v2 as cloudinary } from 'cloudinary';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss'

import { CLOUDINARY_UPLOADS_FOLDER } from '@data/cloudinary';

export default function Share({ resource, url }) {
  const [trasnformations, setTransformations] = useState();

  useEffect(() => {
    (async function run() {
      const transformationResults = await fetch('/api/cloudinary/transformations', {
        url
      }).then(r => r.json());
      setTransformations(transformationResults);
    })();
  }, [url]);

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <div>
          <img src={url} alt="Transformed Image" />
        </div>
        <p>
          <Link href="/camera" passHref={true}>
            <Button>
              Try Your Own
            </Button>
          </Link>
        </p>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ params, query }) {
  const publicId = `${CLOUDINARY_UPLOADS_FOLDER}/${params.publicId}`;
  const resourceResults = await cloudinary.api.resource(publicId);

  const keys = [
    'public_id',
    'resource_type',
    'created_at',
    'width',
    'height',
    'secure_url',
  ];

  const resource = {};

  keys.forEach(key => resource[key] = resourceResults[key]);

  return {
    props: {
      resource,
      url: query.url
    }
  }
}