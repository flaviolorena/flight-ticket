<template>
  <h1 class="font-extrabold text-5xl">Ticket Aviao</h1>
  <div class="grid grid-cols-2">
    <div
      class="col-span-1 grid grid-cols-3 grid-rows-12 bg-gray-200 rounded-2xl m-6"
    >
      <!-- origem -->
      <label class="row-span-1 row-start-1 col-span-1 col-start-1 m-6"
        >País de origem:</label
      >
      <Dropdown
        placeholder="País de origem"
        :options="dataCountries"
        optionLabel="country"
        v-model="selectedCountryOrigin"
        @change="flightFrom(selectedCountryOrigin)"
        class="row-span-1 row-start-1 col-span-1 col-start-2 mx-6 my-2 w-48 h-12 text-center"
      >
      </Dropdown>
      <label class="row-span-1 row-start-2 col-span-1 col-start-1 m-6"
        >Cidade de origem:</label
      >
      <Dropdown
        placeholder="Cidade de origem"
        :options="citiesOrigin"
        optionLabel="city"
        v-model="selectedCityOrigin"
        @change="getLocationOrigin(selectedCityOrigin)"
        class="row-span-1 row-start-2 col-span-1 col-start-2 mx-6 my-2 w-48 h-12 text-center"
      >
      </Dropdown>
      <!-- destino -->
      <label class="row-span-1 row-start-3 col-span-1 col-start-1"
        >País de destino:</label
      >
      <Dropdown
        placeholder="País de destino"
        :options="dataCountries"
        optionLabel="country"
        v-model="selectedCountryDestination"
        @change="flightTo(selectedCountryDestination)"
        class="row-span-1 row-start-3 col-span-1 col-start-2 mx-6 my-2 w-48 h-12 text-center"
      >
      </Dropdown>
      <label class="row-span-1 row-start-4 col-span-1 col-start-1"
        >Cidade de destino:</label
      >
      <Dropdown
        placeholder="Cidade de destino"
        :options="dataCitiesDestination"
        optionLabel="city"
        v-model="selectedCityDestination"
        @change="
          getLocationDestination(selectedCityDestination),
            getDistance(latOrigin, longOrigin, latDestination, longDestination),
            maxMilesCalc(getValueWithMilesAdults(), getValueWithMilesKids())
        "
        class="row-span-1 row-start-4 col-span-1 col-start-2 mx-6 my-2 w-48 h-12 text-center"
      >
      </Dropdown>
      <!-- quantidade -->
      <div
        class="grid grid-cols-9 grid-rows-1 row-span-1 row-start-5 col-span-1 col-start-2 my-3"
      >
        <label
          for="qtAdults"
          class="row-span-1 row-start-1 col-span-3 col-start-1"
          >Adultos:
        </label>
        <InputNumber
          v-model="qtAdults"
          mode="decimal"
          showButtons
          buttonLayout="vertical"
          decrementButtonClass="p-button-secondary"
          incrementButtonClass="p-button-secondary"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          class="row-span-1 row-start-2 col-span-2 col-start-2"
          @change="
            getDistance(latOrigin, longOrigin, latDestination, longDestination),
              maxMilesCalc(getValueWithMilesAdults(), getValueWithMilesKids())
          "
        />
        <label
          for="qtKids"
          class="row-span-1 row-start-1 col-span-3 col-start-6"
          >Crianças:
        </label>
        <InputNumber
          v-model="qtKids"
          mode="decimal"
          showButtons
          buttonLayout="vertical"
          decrementButtonClass="p-button-secondary"
          incrementButtonClass="p-button-secondary"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          class="row-span-1 row-start-2 col-span-2 col-start-7"
          @change="
            getDistance(latOrigin, longOrigin, latDestination, longDestination),
              maxMilesCalc(getValueWithMilesAdults(), getValueWithMilesKids())
          "
        />
      </div>
      <!-- classe do voo  -->
      <p class="row-span-1 row-start-6 col-span-1 col-start-1 text-center mt-3">
        Tipo de voo:
      </p>
      <div class="row-span-1 row-start-8 col-span-3 col-start-1">
        <RadioButton
          name="flightClass"
          value="Econômica"
          v-model="flightClass"
          id="flightClassEx"
          class="mr-2 mx-2 mb-1"
        />
        <label>Econômica</label>
      </div>
      <div class="row-span-1 row-start-8 col-span-3 col-start-1">
        <RadioButton
          name="flightClass"
          value="Executiva"
          v-model="flightClass"
          id="flightClassEx"
          class="mr-3"
        />
        <label>Executiva</label>
      </div>
      <!-- milhas -->
      <p class="row-span-1 row-start-10 col-span-3 col-start-1 mt-4">
        <Checkbox
          v-model="hasMiles"
          :binary="true"
          @change="
            getDistance(latOrigin, longOrigin, latDestination, longDestination),
              maxMilesCalc(getValueWithMilesAdults(), getValueWithMilesKids())
          "
        />
        Tenho milhas para utilizar
      </p>

      <label for="milesDisc"></label>
      <Slider
        class="row-span-1 row-start-10 col-span-3 col-start-2 w-60 my-4 mt-10"
        v-model="milesDisc"
        :step="1"
        :max="maxMiles"
      />
      <p class="row-span-1 row-start-9 col-span-3 col-start-1">
        Utilizar {{ milesDisc.toFixed(2) }} milhas
      </p>

      <Button
        label="Calcular"
        class="row-span-1 row-start-9 col-span-3 col-start-1 mt-7 p-button"
        @click="calculate()"
      />
      <Button
        label="Limpar"
        class="row-span-1 row-start-10 col-span-3 col-start-1 p-button-warning"
        @click="clearForm()"
      />
    </div>
    <!-- resultado -->
    <div
      class="row-span-1 row-start-1 col-span-1 col-start-2 grid grid-rows-3 grid-cols-3 bg-gray-200 rounded-2xl m-6"
    >
      <div
        class="grid grid-rows-6 grid-cols-3 row-span-1 row-start-1 col-span-3 col-start-1 max-h-56"
      >
        <p
          class="row-span-2 row-start-1 col-span-3 col-start-1 max-h-5 text-xl font-semibold"
        >
          Resultado
        </p>

        <p class="row-span-1 row-start-2 col-span-2 col-start-1">Origem:</p>
        <p
          v-if="selectedCityOrigin"
          class="row-span-1 row-start-1 col-span-2 col-start-2 mt-10"
        >
          {{ countryOrigin }} ({{ selectedCityOrigin.city }})
        </p>
        <p class="row-span-1 row-start-1 col-span-2 col-start-1 mt-20">
          Destino:
        </p>
        <p
          v-if="selectedCityDestination"
          class="row-span-1 row-start-1 col-span-2 col-start-2 mt-20"
        >
          {{ countryDestination }} ({{ selectedCityDestination.city }})
        </p>
        <p class="row-span-1 row-start-5 col-span-2 col-start-1">Distância</p>

        <p
          v-show="kmDistance"
          class="row-span-1 row-start-5 col-span-2 col-start-2"
        >
          {{ kmDistance.toFixed(2) }} km
        </p>
        <p class="row-span-1 row-start-6 col-span-3 col-start-1">
          {{ qtAdults }} Adulto(s), {{ qtKids }} Criança(s)
        </p>
      </div>
      <div
        class="grid grid-rows-6 grid-cols-3 row-span-1 row-start-2 col-span-3 col-start-1 max-h-96"
      >
        <label class="row-span-1 row-start-1 col-span-2 col-start-1"
          >Tipo do vôo:
        </label>
        <p
          v-show="flightClass"
          class="row-span-1 row-start-1 col-span-2 col-start-2"
        >
          Classe {{ flightClass }}
        </p>
        <p class="row-span-1 row-start-2 col-span-3 col-start-1">
          Valor Adulto:
          {{
            getValueWithMilesAdults().toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          }}
        </p>
        <p class="row-span-1 row-start-3 col-span-3 col-start-1">
          Valor Criança:
          {{
            getValueWithMilesKids().toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          }}
        </p>
        <p class="row-span-1 row-start-4 col-span-3 col-start-1">
          Valor abatido por milhas:
          {{
            (milesDisc * 0.02).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          }}
          <br />
        </p>
        <p class="row-span-1 row-start-5 col-span-3 col-start-1 font-semibold">
          Total a ser pago:
          {{
            [sumAdultsKids(adultsWithMiles, kidsWithMiles)].toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import json from "../countries.json";

export default {
  data() {
    return {
      dataCountries: json.countries,
      selectedCountryOrigin: "",
      selectedCountryDestination: "",
      selectedCityOrigin: "",
      selectedCityDestination: "",
      citiesOrigin: [],
      countryOrigin: "",
      countryDestination: "",
      dataCitiesDestination: [],
      latOrigin: null,
      longOrigin: null,
      latDestination: null,
      longDestination: null,
      qtAdults: 1,
      qtKids: 0,
      flightClass: "Econômica",
      milesDisc: 0,
      maxMiles: 1,
      kmDistance: 0,
      finalValueAdult: 0,
      finalValueKids: 0,
      adultsWithMiles: 0,
      kidsWithMiles: 0,
      hasMiles: false,
      finalSum: 0,
    };
  },
  methods: {
    flightFrom(selectedCountryOrigin) {
      this.countryOrigin = selectedCountryOrigin.country;
      this.citiesOrigin = selectedCountryOrigin.cities;
    },
    flightTo(selectedCountryDestination) {
      this.countryDestination = selectedCountryDestination.country;
      this.dataCitiesDestination = selectedCountryDestination.cities;
    },
    getLocationOrigin(selectedCity) {
      this.latOrigin = selectedCity.latitude;
      this.longOrigin = selectedCity.longitude;
    },
    getLocationDestination(selectedCity) {
      this.latDestination = selectedCity.latitude;
      this.longDestination = selectedCity.longitude;
    },
    degreesToRadians(degrees) {
      var pi = Math.PI;
      return degrees * (pi / 180);
    },

    getDistance(
      originLatitude,
      originLongitude,
      destinationLatitude,
      destinationLongitude
    ) {
      const EARTH_RADIUS = 6_371.071; // Earth
      const diffLatitudeRadians = this.degreesToRadians(
        destinationLatitude - originLatitude
      );

      const diffLongitudeRadians = this.degreesToRadians(
        destinationLongitude - originLongitude
      );
      const originLatitudeRadians = this.degreesToRadians(originLatitude);
      const destinationLatitudeRadians =
        this.degreesToRadians(destinationLatitude);
      const kmDistance =
        2 *
        EARTH_RADIUS *
        Math.asin(
          Math.sqrt(
            Math.sin(diffLatitudeRadians / 2) *
              Math.sin(diffLatitudeRadians / 2) +
              Math.cos(originLatitudeRadians) *
                Math.cos(destinationLatitudeRadians) *
                Math.sin(diffLongitudeRadians / 2) *
                Math.sin(diffLongitudeRadians / 2)
          )
        );
      this.kmDistance = kmDistance;
    },

    // corrigir calculo
    getValueAdult() {
      const value =
        this.selectedCountryOrigin == this.selectedCountryDestination
          ? this.kmDistance * 0.3 * this.qtAdults
          : this.kmDistance * 0.5 * this.qtAdults;

      return this.flightClass == "Econômica" ? value : value * 1.8;
      //   this.selectedCountryOrigin == this.selectedCountryDestination
      //     ? this.kmDistance * 0.3 * this.qtAdults
      //     : this.kmDistance * 0.5 * this.qtAdults;

      // return this.flightClass == "Econômica" ? value : value * 1.8;
    },

    getValueKids() {
      const value =
        this.selectedCountryOrigin == this.selectedCountryDestination
          ? this.kmDistance * 0.15 * this.qtKids
          : this.kmDistance * 0.25 * this.qtKids;
      console.log(value);
      return this.flightClass == "Econômica" ? value : value * 1.4;
      // const value =
      //   this.selectedCountryOrigin == this.selectedCountryDestination
      //     ? this.kmDistance * 0.15 * this.qtKids
      //     : this.kmDistance * 0.25 * this.qtKids;
      // console.log(value);
      // return this.flightClass == "Econômica" ? value : value * 1.4;
    },
    getValueWithMilesAdults() {
      const valueWithMiles =
        this.getValueAdult().toFixed(2) - this.milesDisc * 0.02;
      this.adultsWithMiles = valueWithMiles < 0 ? 0 : valueWithMiles;
      return this.adultsWithMiles;
      // const valueWithMiles =
      //   this.getValueAdult().toFixed(2) - this.milesDisc * 0.02;
      // this.adultsWithMiles = valueWithMiles < 0 ? 0 : valueWithMiles;
      // return this.adultsWithMiles;
    },
    getValueWithMilesKids() {
      const valueWithMiles =
        this.getValueKids().toFixed(2) - this.milesDisc * 0.02;
      this.kidsWithMiles = valueWithMiles < 0 ? 0 : valueWithMiles;
      return this.kidsWithMiles;
      // const valueWithMiles =
      //   this.getValueKids().toFixed(2) - this.milesDisc * 0.02;
      // this.kidsWithMiles = valueWithMiles < 0 ? 0 : valueWithMiles;
      // return this.kidsWithMiles;
    },

    // mexer no calculo de milha
    maxMilesCalc(adults, kids) {
      const value = (adults + kids) / 0.02;
      this.maxMiles = value;
      // const value = (adults + kids) / 0.02;
      // this.maxMiles = value;
    },
    sumAdultsKids(adults, kids) {
      this.finalSum = adults + kids;
      return this.finalSum;
      // this.finalSum = adults + kids;
      // return this.finalSum;
    },
    calculate() {
      // açao final botao calcular
    },
    clearForm() {
      this.selectedCountryOrigin = "";
      this.selectedCountryDestination = "";
      this.selectedCityOrigin = "";
      this.selectedCityDestination = "";
      this.citiesOrigin = [];
      this.countryOrigin = "";
      this.countryDestination = "";
      this.dataCitiesDestination = [];
      this.latOrigin = null;
      this.longOrigin = null;
      this.latDestination = null;
      this.longDestination = null;
      this.qtAdults = 1;
      this.qtKids = 0;
      this.flightClass = "Econômica";
      this.milesDisc = 0;
      this.maxMiles = 1;
      this.kmDistance = 0;
      this.finalValueAdult = 0;
      this.finalValueKids = 0;
      this.adultsWithMiles = 0;
      this.kidsWithMiles = 0;
      this.hasMiles = false;
      this.finalSum = 0;
      return;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.inputNum {
  width: 10px !important;
  height: 20px !important;
}

.p-slider {
  width: 300px;
}
.milesDisc {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
