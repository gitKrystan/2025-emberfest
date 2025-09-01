import { pageTitle } from 'ember-page-title';

import { Layout } from '#components/layout';

<template>
  {{pageTitle "TodoMVC"}}

  <Layout>
    {{outlet}}
  </Layout>
</template>
