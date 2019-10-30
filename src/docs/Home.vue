<template>
    <div class="home-content">
        <div class="section jumbotron">
            <div class="jumbotron-image" style="background-image: url('https://images.unsplash.com/photo-1478088702756-f16754aaf0c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80')"></div>
            <sparks />
            <div class="grid-container jumbotron-content">
                <div class="grid-x">
                    <div class="cell medium-10 large-8">
                        <p class="h2 jumbotron-text">{{ $t('A complete Node.js ecosystem with an elegant syntax to drive sparkling ideas') }}</p>
                        <router-link class="button" :to="docLink" v-text="$t('Get started!')" />
                    </div>
                </div>
            </div>
        </div>
        <section class="section about">
            <div class="grid-container">
                <div class="grid-x">
                    <div class="cell medium-7">
                        <p>Node IoC is a <a href="https://nodejs.org" target="_blank">Node.js</a> framework designed to help developers create elegant and well-designed applications, for both the Web and the CLI.</p>
                        <p>Easy to use for beginners, but strong enough for advanced JavaScript engineers, it was built with the developers in mind to make their life easier when it comes to build simple to complex application architecture, with a scalable, modular approach.</p>
                        <p>Based on <em><a href="(https://en.wikipedia.org/wiki/SOLID">SOLID</a></em> principles, it comes out with a lot of features that removes the pain of crafting new applications:</p>
                    </div>
                    <div class="cell medium-4 medium-offset-1">
                        <div class="card shadow padding-1 first-steps">
                            <div class="card-section">
                                <p class="separator-left">Our simple step-by-step tutorial will show you how to craft your first application the proper way in minutes, so you can start building something amazing today!</p>
                            </div>
                            <div class="card-section">
                                <router-link class="button" :to="createACommandLink">Take your first step</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="section features">
            <div class="grid-container">
                <div class="grid-x">
                    <div class="cell large-6">
                        <ul class="margin-bottom-0">
                            <li>Simple, yet powerful, <router-link :to="containerLink">dependency injection container</router-link></li>
                            <li>Complete <router-link :to="commandLink">CLI command system</router-link> powered by <a href="http://yargs.js.org" target="_blank">Yargs</a></li>
                            <li>Full <router-link :to="routingLink">routing and HTTP handling</router-link> powered by <a href="https://expressjs.com" target="_blank">Express</a></li>
                            <li><a href="http://knexjs.org" target="_blank">Knex</a>&nbsp;<router-link :to="databaseLink">database connections</router-link> with <a href="https://bookshelfjs.org" target="_blank">Bookshelf ORM</a></li>
                            <li><router-link :to="cachingLink">Cache</router-link> system with multiple back-ends</li>
                        </ul>
                    </div>
                    <div class="cell large-6">
                        <ul class="margin-bottom-0">
                            <li><router-link :to="configLink">Configuration</router-link> over code approach</li>
                            <li>Multiple 3rd-party integrations such as <a href="https://github.com/mroderick/PubSubJS" target="_blank">PubSubJS</a>, <a href="https://hapi.dev/family/joi" target="_blank">joi</a>, <a href="https://www.jsviews.com" target="_blank">JsRender</a> and much more</li>
                            <li><router-link :to="serviceProviderLink">Modular</router-link> structure with simple integration</li>
                            <li>Complete and powerful <a href="https://jestjs.io/" target="_blank">Jest</a> integration for testing with a <router-link :to="testClassLink">class-based</router-link> approach, like <a href="https://phpunit.de" target="_blank">PHPUnit (PHP)</a> or <a href="https://nunit.org" target="_blank">NUnit (C#)</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        <section class="section inspirations">
            <div class="grid-container">
                <div class="grid-x">
                    <div class="cell medium-10 medium-offset-1 large-8 large-offset-2 text-center">
                        <p>Node IoC was mostly inspired by <a href="https://laravel.com" target="_blank">Laravel</a> and <a href="https://symfony.com" target="_blank">Symfony</a> for the structure, as well by <a href="https://angularjs.org" target="_blank">Angular.js</a> for the dependency injection approach.</p>
                        <p>The key that makes Node IoC a better platform to start with is that it is based on all the best things that have been made in JavaScript so far: it unifies the most popular tools and makes implementing them under a complex application feel like a breeze.</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="section packages">
            <div class="grid-container">
                <p class="lead">Out-of-the-box package implementations:</p>
                <div class="grid-x">
                    <div class="cell medium-3" v-for="(group,index) in packageGroups" :key="index">
                        <ul class="margin-bottom-0">
                            <li v-for="p in group" :key="p"><a :href="`https://npmjs.com/package/${p}`" target="_blank" v-text="p"></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        <section class="section">
            <div class="grid-container">
                <p class="lead">Want to make a difference?</p>
                <div class="grid-x">
                    <div class="cell medium-4">
                        <p class="margin-bottom-0"><strong>Send us some feedback</strong></p>
                        <p>at <a href="mailto:opensource@absolunet.com">opensource@absolunet.com</a></p>
                    </div>
                    <div class="cell medium-4">
                        <p class="margin-bottom-0"><strong>Propose a feature</strong></p>
                        <p>on <a href="https://github.com/absolunet/node-ioc/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=%5BFEATURE%5D" target="_blank">GitHub</a></p>
                    </div>
                    <div class="cell medium-4">
                        <p class="margin-bottom-0"><strong>Open an issue</strong></p>
                        <p>on <a href="https://github.com/absolunet/node-ioc/issues/new/choose" target="_blank">GitHub</a></p>
                    </div>
                    <div class="cell medium-4">
                        <p class="margin-bottom-0"><strong>Create a pull request</strong></p>
                        <p>on <a href="https://github.com/absolunet/node-ioc/pulls" target="_blank">GitHub</a></p>
                    </div>
                    <div class="cell medium-4">
                        <p class="margin-bottom-0"><strong>Create a package</strong></p>
                        <p>to <router-link :to="serviceProviderLink">extend</router-link> the framework</p>
                    </div>
                    <div class="cell medium-4">
                        <p class="margin-bottom-0"><strong>...become one of us!</strong></p>
                        <p><a href="https://absolunet.com/en/careers/" target="_blank">Join Absolunet for your dream job</a></p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import Sparks from './Sparks';

    export default {
        components: {
			Sparks
		},
        beforeCreate() {
            document.body.classList.add('home-page');
        },
        beforeDestroy() {
            document.body.classList.remove('home-page');
        },
        data: () => ({
            packages: [
				'@absolunet/fsp',
				'@absolunet/fss',
				'@absolunet/private-registry',
				'@absolunet/terminal',
				'@hapi/joi',
				'axios',
				'bookshelf',
				'dotenv',
				'express',
				'faker',
				'inquirer',
				'jsrender',
				'knex',
				'moment',
				'nodemon',
				'ouch',
				'pretty-error',
				'pubsub-js',
				'yargs',
			]
        }),
        computed: {
			docLink() {
				return this.getLink('/getting-started/installation');
			},
			containerLink() {
                return this.getLink('/architecture/container');
            },
			commandLink() {
                return this.getLink('/basics/commands');
            },
			routingLink() {
                return this.getLink('/basics/routing');
            },
			databaseLink() {
                return this.getLink('/data/database');
            },
			cachingLink() {
                return this.getLink('/data/caching');
            },
            configLink() {
                return this.getLink('/basics/configuration');
            },
            serviceProviderLink() {
                return this.getLink('/architecture/service-provider');
            },
			testClassLink() {
                return this.getLink('/tests/test-class');
            },
			createACommandLink() {
				return this.getLink('/first-steps/create-a-command');
            },
            packageGroups() {
				return this.packages.reduce((groups, p, i, array) => {
					const group = Math.floor(i / array.length * 4);
					groups[group] = groups[group] || [];
					groups[group].push(p);

					return groups;
                }, []);
            }
        },
        methods: {
            getLink(path) {
				return `${this.$route.path}${this.$t(`path.original.${path}`)}`;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../lib/config/design';
    $jumbotron-offset: 1em;
    $section-padding-map: (
            small: 2em,
            medium: 5em
    );

    .home-content {
        font-size: 1.25em;
    }

    .jumbotron {
        position: relative;
        color: $white;
        overflow: hidden;
    }

    .jumbotron-content {
        position: relative;
    }

    .jumbotron-text {
        margin-bottom: 1em;
        text-shadow: 0 2px 10px rgba($black, 0.25);
    }

    .jumbotron-image {
        position: absolute;
        z-index: -1;
        background: no-repeat center left;
        background-size: cover;
        filter: blur($jumbotron-offset / 2);

        @each $side in (top, right, bottom, left) {
            #{$side}: -$jumbotron-offset;
        }
    }

    .first-steps {
        margin-top: 1em;
    }

    .features {
        li {
            margin-bottom: 1.6em;
        }
    }

    .inspirations {
        background-color: map-get($foundation-palette, 'secondary');
        color: $white;
        font-weight: 700;
    }

    .packages {
        background-color: $light-gray;
    }

    .button {
        text-transform: uppercase;
        font-weight: bold;
    }

    @each $size, $padding in $section-padding-map {
        @include breakpoint($size) {
            .section {
                padding: $padding 0;
            }
        }
    }

    @include breakpoint(medium) {
        .jumbotron {
            padding: 6em 0;
        }

        .first-steps {
            margin-top: 0;
        }
    }
</style>
