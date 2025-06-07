import Highcharts from "highcharts";
import "highcharts/modules/exporting";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      highcharts: Highcharts,
    },
  };
});
