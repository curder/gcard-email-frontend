<template>
    <renderless-pagination
            :data="data"
            :limit="limit"
            :show-disabled="showDisabled"
            :size="size"
            :align="align"
            v-on:pagination-change-page="onPaginationChangePage">

        <ul class="pagination flex items-center"
            :class="{
                'pagination-sm': size == 'small',
                'pagination-lg': size == 'large',
                'justify-content-center': align == 'center',
                'justify-content-end': align == 'right'
            }"
            v-if="computed.total > computed.perPage"
            slot-scope="{ data, limit, showDisabled, size, align, computed, prevButtonEvents, nextButtonEvents, pageButtonEvents }">

            <li class="border px-2 py-1 rounded bg-blue-500 text-white page-item pagination-prev-nav"
                :class="{'disabled': !computed.prevPageUrl}" v-if="computed.prevPageUrl || showDisabled">
                <a class="page-link text-xs flex items-center justify-center" href="#" aria-label="Previous"
                   :tabindex="!computed.prevPageUrl && -1" v-on="prevButtonEvents">
                    <slot name="prev-nav">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                    </slot>
                </a>
            </li>

            <li class="page-item pagination-page-nav ml-2"
                v-for="(page, key) in computed.pageRange"
                :key="key">

                <a class="page-link flex items-center border px-2 y-1 rounded" href="#"
                   :class="{ 'active bg-gray-200 border-gray-600 text-gray-700': page === computed.currentPage, 'border-blue-600 bg-blue-500 text-white': page !== computed.currentPage }"
                   v-on="page !== computed.currentPage && pageButtonEvents(page)">
                    {{ page }}
                    <!--<span class="sr-only" v-if="page == computed.currentPage">(current)</span>-->
                </a>
            </li>

            <li class="border px-2 py-1 ml-2 rounded bg-blue-500 text-white page-item pagination-next-nav" :class="{'disabled': !computed.nextPageUrl}"
                v-if="computed.nextPageUrl || showDisabled">
                <a class="page-link text-xs flex items-center justify-center" href="#" aria-label="Next" :tabindex="!computed.nextPageUrl && -1"
                   v-on="nextButtonEvents">
                    <slot name="next-nav">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                    </slot>
                </a>
            </li>

        </ul>

    </renderless-pagination>
</template>

<script>
    import RenderlessPagination from './RenderlessPagination.vue';

    export default {
        props: {
            data: {
                type: Object,
                default: () => {
                }
            },
            limit: {
                type: Number,
                default: 0
            },
            showDisabled: {
                type: Boolean,
                default: false
            },
            size: {
                type: String,
                default: 'default',
                validator: value => {
                    return ['small', 'default', 'large'].indexOf(value) !== -1;
                }
            },
            align: {
                type: String,
                default: 'left',
                validator: value => {
                    return ['left', 'center', 'right'].indexOf(value) !== -1;
                }
            }
        },

        methods: {
            onPaginationChangePage(page) {
                this.$emit('pagination-change-page', page);
            }
        },

        components: {
            RenderlessPagination
        }
    }
</script>
