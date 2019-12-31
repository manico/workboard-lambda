import { shallowMount } from '@vue/test-utils';
import WorkboardCard from '@/components/WorkboardCard.vue';

describe('WorkboardCard.vue', () => {
  it('is Vue instance', () => {
    const wrapper = shallowMount(WorkboardCard);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
