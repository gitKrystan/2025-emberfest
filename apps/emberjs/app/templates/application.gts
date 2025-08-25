import { pageTitle } from 'ember-page-title';
import Attribution from '#components/attribution';
import Layout from '#components/layout';

<template>
  {{pageTitle "TodoMVC"}}

  <Layout>
    {{outlet}}
  </Layout>

  <Attribution />
</template>
