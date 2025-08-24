import { pageTitle } from 'ember-page-title';
import Attribution from 'todomvc/components/attribution';
import Layout from 'todomvc/components/layout';

<template>
  {{pageTitle "TodoMVC"}}

  <Layout>
    {{outlet}}
  </Layout>

  <Attribution />
</template>
