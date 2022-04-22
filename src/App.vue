<template>
  <h1 class="font-extrabold text-5xl">Ticket Aviao</h1>
  <div class="grid grid-cols-2">
    <div
      class="col-span-1 grid grid-cols-3 grid-rows-15 bg-gray-200 rounded-2xl m-6"
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
            isTheSame(selectedCityOrigin, selectedCityDestination)
        "
        class="row-span-1 row-start-4 col-span-1 col-start-2 mx-6 my-2 w-48 h-12 text-center"
      >
      </Dropdown>
      <span 
      v-if="sameDest"
      class=" delay-2000 text-sm text-red-600 row-span-1 row-start-5 col-span-3 col-start-1 mx-6 w-full h-12 text-center content-center mx-auto"

      >O destino deve ser diferente da origem</span>
      <!-- quantidade -->
      <div
        class="grid grid-cols-9 grid-rows-1 row-span-1 row-start-6 col-span-1 col-start-2 my-6"
      >
        <label
          for="qtAdults"
          class="row-span-1 row-start-1 col-span-3 col-start-1 "
          >Adultos:
        </label>
        <InputNumber
          v-model="qtAdults"
          mode="decimal"
          showButtons
          min="1"
          buttonLayout="vertical"
          decrementButtonClass="p-button-secondary"
          incrementButtonClass="p-button-secondary"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          class="row-span-1 row-start-2 col-span-2 col-start-2"
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
          min="0"
          buttonLayout="vertical"
          decrementButtonClass="p-button-secondary"
          incrementButtonClass="p-button-secondary"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          class="row-span-1 row-start-2 col-span-2 col-start-7"
        />
      </div>
      <!-- classe do voo  -->
      <p class="row-span-1 row-start-7 col-span-1 col-start-1 text-center mt-3">
        Tipo de voo:
      </p>
      <div class="row-span-1 row-start-8 col-span-3 col-start-1">
        
      </div>
      <div class="row-span-1 row-start-9 col-span-3 col-start-1">
         <RadioButton
          name="flightClass"
          value="Econômica"
          v-model="flightClass"
          id="flightClassEx"
          class="mr-2 mx-2 mb-1"
        />
        <label>Econômica</label>

        <RadioButton
          name="flightClass"
          value="Executiva"
          v-model="flightClass"
          id="flightClassEx"
          class="ml-4 mr-2 mb-1"
        />
        <label class="ml-">Executiva</label>
       
      </div>
      <!-- milhas -->
      <span class="row-span-1 row-start-10 col-span-3 col-start-1 mt-4 content-center	
      ">
        <Checkbox
          class="mr-2"
          v-model="hasMiles"
          :binary="true"
          @change="
            getValueKids(), getValueAdult(), maxMilesCalc(valueAdult, valueKids)
          "
        />

        <label for="milesDisc">Tenho milhas para utilizar</label>
      </span>

      <div v-if="hasMiles"
      class="row-span-1 row-start-11 col-span-3 col-start-1 mt-4 mx-auto content-center"
      >
        <Slider
          class="my-3"
          v-model="milesDisc"
          :step="10"
          :max="maxMiles"
          :disabled="mileSlider ? '' : disabled"
        />

        <p class="row-span-1 row-start-12 col-span-3 col-start-1">
          Utilizar {{ milesDisc.toFixed(2) }} milhas
        </p>
      </div>

      <Button
        v-if="calcBtn"
        label="Calcular"
        class="row-span-1 row-start-9 col-span-3 col-start-1 mt-7 p-button"
        @click="
          getDistance(latOrigin, longOrigin, latDestination, longDestination),
            maxMilesCalc(valueAdult, valueKids),
            calculate()
        "
      />
      <Button
        v-if="!calcBtn"
        label="Limpar"
        class="row-span-1 row-start-10 col-span-3 col-start-1 mt-7 p-button-warning"
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
            valueAdult.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          }}
        </p>
        <p class="row-span-1 row-start-3 col-span-3 col-start-1">
          Valor Criança:
          {{
            valueKids.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          }}
        </p>
        <p class="row-span-1 row-start-4 col-span-3 col-start-1">
          Valor abatido por milhas:
          {{
            milesPrice.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          }}
          <br />
        </p>
        <p class="row-span-1 row-start-5 col-span-3 col-start-1 font-semibold">
          Total a ser pago:
          {{
            [sumAdultsKids(valueAdult, valueKids)].toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
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
      maxMiles: null,
      kmDistance: 0,
      hasMiles: false,
      milesPrice: 0,
      valueKids: 0,
      valueAdult: 0,
      finalSum: 0,
      mileSlider: false,
      calcBtn:true,
      sameDest:false,
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
    isTheSame(origin, destination) {
      if (origin == destination){
      setTimeout(() => {this.sameDest = false},5000)
        this.clearForm();
        this.calcBtn = false;
        return this.sameDest = true;

      }
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

    getValueAdult() {
      const value =
        this.selectedCountryOrigin == this.selectedCountryDestination
          ? this.kmDistance * 0.3 * this.qtAdults
          : this.kmDistance * 0.5 * this.qtAdults;

      return this.flightClass == "Econômica"
        ? (this.valueAdult = value)
        : (this.valueAdult = value * 1.8);
    },

    getValueKids() {
      const value =
        this.selectedCountryOrigin == this.selectedCountryDestination
          ? this.kmDistance * 0.15 * this.qtKids
          : this.kmDistance * 0.25 * this.qtKids;
      return this.flightClass == "Econômica"
        ? (this.valueKids = value)
        : (this.valueKids = value * 1.4);
    },

    milesDiscPrice() {
      const value = this.milesDisc * 0.02;
      return (this.milesPrice = value);
    },
    maxMilesCalc(adults, kids) {
      console.log("calculo max feito");
      console.log(adults);
      this.getValueKids();
      this.getValueAdult();
      const value = (adults + kids) / 0.02;
      this.maxMiles = value;
    },
    sumAdultsKids(adults, kids) {
      this.finalSum = adults + kids - this.milesPrice;
      return this.finalSum;
    },
    calculate() {
      this.getValueKids();
      this.getValueAdult();
      this.milesDiscPrice();
      this.calcBtn = !this.calcBtn;
      const value = this.valueKids + this.valueAdult - this.milesPrice;
      return (this.finalSum = value);
    },
    clearForm() {
      this.qtAdults = 1;
      this.qtKids = 0;
      this.flightClass = "Econômica";
      this.milesDisc = 0;
      this.maxMiles = null;
      this.kmDistance = 0;
      this.hasMiles = false;
      this.milesPrice= 0;
      this.valueKids= 0;
      this.valueAdult= 0;
      this.finalSum= 0;
      this.finalSum = 0;
      this.calcBtn = true;
      this.sameDest = false,
      this.cleanBtn = !this.cleanBtn;


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
