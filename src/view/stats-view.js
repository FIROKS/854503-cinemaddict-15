import SmartView from './smart-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { filmsFromPeriod, genresCount, topGenre, totalDuration, watchedCount } from '../utils/stats';
import { StatsFilters } from '../const';
import { capitalizeFirstLetter } from '../utils/utils';
import { getUserRank } from '../utils/utils';


const renderStatsChart = (films, statisticCtx) => {
  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * 5;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: ['Sci-Fi', 'Animation', 'Fantasy', 'Comedy', 'TV Series'],
      datasets: [{
        data: genresCount(films),
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createFiltersTemplate = (currentFilter) => {
  const createStatsFilterTemplate = (filter) => (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter}" value="${filter}" ${currentFilter === filter ? 'checked' : ''}>
    <label for="statistic-${filter}" class="statistic__filters-label">${capitalizeFirstLetter(filter)}</label>`
  );

  return Object.values(StatsFilters).map((filter) => createStatsFilterTemplate(filter)).join('');
};

export default class StatsView extends SmartView {
  constructor(films) {
    super();
    this._data = {
      films,
      filteredFilms: films,
      currentStatsFilter: StatsFilters.ALL_TIME,
    };

    this._periodClickHandler = this._periodClickHandler.bind(this);
  }

  restoreHandlers() {
    this._setChart();
  }

  _periodClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      currentStatsFilter: evt.target.value,
      filteredFilms: filmsFromPeriod(this._data.films, new Date(), evt.target.value),
    }, true);
  }

  _setChart() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    this._chart = renderStatsChart(this._data.filteredFilms, statisticCtx);
    this._duration = totalDuration(this._data.filteredFilms);

    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._periodClickHandler);
  }

  getTemplate() {
    const duration = totalDuration(this._data.filteredFilms);
    const watchedAmount = watchedCount(this._data.filteredFilms);

    return (
      `<section class="statistic">
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${getUserRank(this._data.films)}</span>
        </p>

        <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
          <p class="statistic__filters-description">Show stats:</p>

          ${createFiltersTemplate(this._data.currentStatsFilter)}
        </form>

        <ul class="statistic__text-list">
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">You watched</h4>
            <p class="statistic__item-text">${watchedAmount ? watchedAmount : '0'} <span class="statistic__item-description">${watchedAmount !== 1 ? 'movies' : 'movie'}</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Total duration</h4>
            <p class="statistic__item-text">${duration.hours ? duration.hours : '0'} <span class="statistic__item-description">h</span> ${duration.minutes ? duration.minutes : '0'} <span class="statistic__item-description">m</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Top genre</h4>
            <p class="statistic__item-text">${this._data.filteredFilms ? topGenre(this._data.filteredFilms) : ''}</p>
          </li>
        </ul>

        <div class="statistic__chart-wrap">
          <canvas class="statistic__chart" width="1000"></canvas>
        </div>

      </section>`
    );
  }
}
