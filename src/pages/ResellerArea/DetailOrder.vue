<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="mobile-layout-on-desktop">
      <q-toolbar class="bg-distrodakwah text-white">
        <q-btn
          flat
          round
          dense
          to="/orderList"
        >
          <q-icon name="arrow_back" color="white" /> 
        </q-btn>
        <q-toolbar-title><span style="font-size: 16px; font-weight: bold">Invoice {{ dataOrder.invoice }}</span></q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer class="bg-white text-black mobile-layout-on-desktop" style="border-top: 2px solid #eee" v-if="this.dataOrder.status === 'waiting_payment'">
      <q-toolbar class="bg-white text-black">
        <q-space />
        <q-btn
          flat
          class="bg-orange-8 text-white full-width"
          @click="paymentConfirmation = true"
        >
          Konfirmasi Pembayaran
        </q-btn>
      </q-toolbar>
    </q-footer>

    <q-page-container class="mobile-layout-on-desktop">
      <q-page class="bg-white">
        <div class="bg-white" style="height: 100%">
          <div style="background-color: white;; padding: 13px 0 10px 0">
            <div class="row q-px-lg">
              <div class="col">
                <h5 class="title-text" style="font-weight: normal;">Tgl Order : {{ dataOrder.created_at ? new Date(dataOrder.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'numeric', day: 'numeric' }) : '' }}</h5>
              </div>
              <div class="col text-right">
                <q-btn flat disable size="sm" class="bg-orange-8 text-white" style="text-transform: capitalize;" v-if="dataOrder.status === 'waiting_payment'">Menunggu Pembayaran</q-btn>
                <q-btn flat disable size="sm" class="bg-orange-8 text-white" style="text-transform: capitalize;" v-else-if="dataOrder.status === 'waiting_fo_verification'">Menunggu Verifikasi</q-btn>
                <q-btn flat disable size="sm" class="bg-orange-8 text-white" style="text-transform: capitalize;" v-else-if="dataOrder.status === 'payment_confirmed'">Sudah Dibayar</q-btn>
                <q-btn flat disable size="sm" class="bg-blue-8 text-white" style="text-transform: capitalize;" v-else-if="dataOrder.status === 'processed'">Sedang Diproses</q-btn>
                <q-btn flat disable size="sm" class="bg-orange-8 text-white" style="text-transform: capitalize;" v-else-if="dataOrder.status === 'packing'">Sedang Dikemas</q-btn>
                <q-btn flat disable size="sm" class="bg-green-8 text-white" style="text-transform: capitalize;" v-else-if="dataOrder.status === 'shipped'">Sedang Dikirim</q-btn>
                <q-btn flat disable size="sm" class="bg-orange-8 text-white" style="text-transform: capitalize;" v-else-if="dataOrder.status === 'done'">Selesai</q-btn>
                <q-btn flat disable size="sm" class="bg-orange-8 text-white" style="text-transform: capitalize;" v-else-if="dataOrder.status === 'pending'">Pending</q-btn>
                <q-btn flat disable size="sm" class="bg-orange-8 text-white" style="text-transform: capitalize;" v-else-if="dataOrder.status === 'rejected'">Dibatalkan</q-btn>
              </div>
            </div>
            <br/>
            <div class="row q-px-lg" v-if="dataOrder.status === 'shipped'">
              <div class="col">
                <h5 class="title-text">Info Pengiriman</h5>
              </div>
            </div>
            <div class="row q-px-lg q-py-sm" v-if="dataOrder.status === 'shipped'" style="margin-bottom: 10px">
              <div class="col" v-if="dataTracking !== []">
                <q-markup-table dense bordered flat>
                  <tbody>
                    <tr>
                      <td class="text-left">No Resi</td>
                      <td class="text-right text-bold">{{ dataOrder.awb }}</td>
                    </tr>
                    <tr>
                      <td class="text-left">Status</td>
                      <td class="text-right text-bold">{{ dataTracking.status }}</td>
                    </tr>
                    <tr>
                      <td class="text-left">Ekspedisi</td>
                      <td class="text-right">{{ dataOrder.courier_name }}</td>
                    </tr>
                    <tr>
                      <td class="text-left">Service</td>
                      <td class="text-right">{{ dataOrder.service_name }}</td>
                    </tr>
                    <tr>
                      <td class="text-left">Dikirim Tanggal</td>
                      <td class="text-right">{{ dataTracking.summary.date }}</td>
                    </tr>
                    <tr>
                      <td class="text-left">Dikirim Oleh</td>
                      <td class="text-right">{{ dataTracking.detail.shipper }}</td>
                    </tr>
                    <tr>
                      <td class="text-left">Dikirim Kepada</td>
                      <td class="text-right">{{ dataTracking.detail.receiver }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <br/>
                <q-timeline color="orange-8">
                  <q-timeline-entry
                    v-for="(ship, i) in dataTracking.history"
                    :key="i"
                    :title="ship.date + ' - ' + ship.location"
                    :subtitle="ship.desc"
                  />
                </q-timeline>
              </div>
            </div>
            <div class="row q-px-lg">
              <div class="col">
                <h5 class="title-text">Rincian Pesanan</h5>
              </div>
            </div>
            <br/>
            <template v-if="totalItem > 0">
              <div class="row q-px-lg" v-for="(item, index) in items" :key="index">
                <div class="col-3">
                  <img :src="item.product_image" width="100%" style="border: 1px solid whitesmoke" />
                </div>
                <div class="col-6" style="padding: 0 15px">
                  <h5 style="margin: 0; font-size: 14px; font-weight: bold; line-height: 16px">{{ item.product_name }}</h5>
                  <h6 style="margin: 5px 0 0 0; font-size: 12px; line-height: 14px"><span v-for="(opt, i) in item.options" :key="i">{{opt.option + ': ' + opt.value}} </span></h6>
                  <h6 style="margin: -5px 0 0 0; font-size: 12px;">Qty {{ item.qty }} x Rp{{ formatPrice(item.price) }}</h6>
                </div>
                <div class="col-3 text-right">
                  <h6 style="margin: 0; font-size: 12px;" class="text-black">Rp{{ formatPrice(item.qty * item.price) }}</h6>
                </div>
              </div>
            </template>
            <br/>
            <div class="row q-pl-lg q-pr-md">
              <div class="col">
                <h5 class="title-text">Ringkasan Pembayaran</h5>
              </div>
              <!-- <div class="col text-right">
                <h5 class="link-text text-red">Lihat Detail</h5>
              </div> -->
            </div>
            <div class="row q-px-lg items-center" style="padding-top: 15px; padding-bottom: 15px">
              <div class="col-xs-8">
                <h6 style="font-size: 12px; margin: 0; font-family: 'Open Sans'; line-height: 18px">Total Harga Barang</h6>
                <h6 style="font-size: 12px; margin: 0; font-family: 'Open Sans'; line-height: 18px">Ongkos Kirim</h6>
                <!-- <h6 style="font-size: 12px; margin: 0; font-family: 'Open Sans'; line-height: 18px">Donasi</h6> -->
              </div>
              <div class="col-xs-4 text-right">
                <h6 style="margin: 0; font-size: 12px; line-height: 18px" class="text-black">Rp{{ formatPrice(dataOrder.total_amount) }}</h6>
                <h6 style="margin: 0; font-size: 12px; line-height: 18px" class="text-black">Rp{{ formatPrice(dataOrder.shipment_fee) }}</h6>
                <!-- <h6 style="margin: 0; font-size: 12px; line-height: 18px" class="text-black">Rp600</h6> -->
              </div>
            </div>
            <center>
              <hr style="border: 1px solid #eee; width: 90%;" />
            </center>
            <div class="row q-px-lg">
              <div class="col">
                <h5 style="font-size: 21px; margin: 0; font-family: 'Open Sans'; font-weight: bold">Total</h5>
              </div>
              <div class="col text-right">
                <h5 style="font-size: 21px; margin: 0; font-family: 'Open Sans'; font-weight: bold">Rp{{ formatPrice(dataOrder.grand_total + dataOrder.code_unique) }}</h5>
              </div>
            </div>
            <div class="row q-px-lg items-center">
              <div class="col-xs-8">
                <h6 style="font-size: 12px; margin: 0; font-family: 'Open Sans'; line-height: 18px">Kode Unik</h6>
              </div>
              <div class="col-xs-4 text-right">
                <h6 style="margin: 0; font-size: 12px; line-height: 18px" class="text-black">Rp-{{ formatPrice(dataOrder.code_unique) }}</h6>
              </div>
            </div>
          </div>
          <div style="background-color: white;; padding: 13px 0 10px 0" v-if="dataOrder.status === 'waiting_payment'">
            <div class="row q-pa-lg">
              <div class="col">
                <div class="row q-px-sm">
                  <div class="col">
                    <h6 style="font-size: 14px; margin: 10px 0; font-family: 'Open Sans'; text-align: center;">Total Yang Harus Kamu Transfer</h6>
                    <h6 style="font-size: 36px; margin: 0 0 18px 0; font-family: 'Open Sans'; text-align: center; font-weight: bold">Rp{{ formatPrice(dataOrder.grand_total) }} <q-btn @click="copyTotalTransfer" flat size="xs" class="bg-red text-white">Salin</q-btn></h6>
                    <h6 style="font-size: 12px; margin: 10px 0; font-family: 'Open Sans'; text-align: center; line-height: 16px">Silahkan lakukan pembayaran melalui transfer bank ke salah satu rekening dibawah ini sebelum :</h6>
                    <h6 class="text-center bg-yellow text-bold" style="font-size: 11px; margin: 0">{{ dataOrder.expired_time ? new Date(dataOrder.expired_time*1000).toLocaleString('id-ID', { dateStyle: 'full', timeZone: 'Asia/Jakarta' }) : '' }} pukul {{ dataOrder.expired_time ? new Date(dataOrder.expired_time*1000).toLocaleTimeString('en-GB') : '' }} WIB (1x24 jam)</h6>
                  </div>
                </div>
                <br/>
                <q-list>
                  <q-item v-for="(bank, index) in dataBank" :key="index">
                    <q-item-section side>
                      <img :src="bank.bank_image" width="50" />
                    </q-item-section>

                    <q-item-section side>{{ bank.account_number }}<br/><span style="font-size: 10px">A.N {{ bank.account_name }}</span></q-item-section>

                    <q-item-section><q-btn @click="copyAccountNumber(bank.account_number)" flat size="xs" class="bg-red text-white">Salin</q-btn></q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
            <br/>
          </div>
        </div>
      </q-page>

      <q-dialog v-model="paymentConfirmation" position="bottom">
        <q-card style="min-width: 360px">
          <q-card-section>
            <div class="text-h6">Konfirmasi Pembayaran</div>
          </q-card-section>

          <q-card-section>
            <q-select 
              color="orange-8"
              dense
              outlined
              v-model="bankReceiver"
              :options="dataBank"
              option-value="bank_name"
              option-label="bank_name"
              label="Bank Tujuan"
              emit-value
              map-options
              style="margin-bottom: 5px"
            />
            <q-input type="text" color="orange-8" v-model="bankSender" label="Transfer Dari Bank" dense outlined style="margin-bottom: 5px" />
            <q-input type="text" color="orange-8" v-model="senderName" label="Nama Pengirim" dense outlined style="margin-bottom: 5px" />
            <q-input type="number" color="orange-8" v-model="totalTransfer" label="Total Transfer" dense outlined style="margin-bottom: 5px" />
            <div class="q-field row no-wrap items-start bg-grey-2 q-mb-sm q-input q-field--outlined q-field--float q-field--dense">
              <div class="q-field__inner relative-position col self-stretch column justify-center">
                <div class="q-field__control relative-position row no-wrap text-orange-8">
                  <div class="q-field__control-container col relative-position row no-wrap q-anchor--skip">
                    <flat-pickr v-model="transferDate" class="q-field__native" placeholder="Tanggal Transfer"></flat-pickr>
                  </div>
                </div>
              </div>
            </div>
            <!-- <q-input dense outlined v-model="transferDate" color="orange-8" placeholder="Tanggal Transfer">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="transferDate" mask="YYYY-MM-DD" color="orange-8" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input> -->
          </q-card-section>

          <q-card-actions class="q-px-md">
            <q-btn flat label="Konfirmasi Sekarang" color="white" class="bg-orange-8 text-capitalize full-width" @click="postPaymentConfirmation" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import { showOrderUrl, identityBankUrl, paymentConfirmationUrl, paymentConfirmOrderUrl, trackingUrl, catalogProductUrl, getHeader } from 'src/config';
import VueClipboard from 'vue-clipboard2';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { openURL } from 'quasar';

export default {
  components: {
    flatPickr
  },
  data () {
    return {
      dataBank: [],
      dataOrder: [],
      // Payment Confirmation
      bankReceiver: '',
      bankSender: '',
      senderName: '',
      totalTransfer: 0,
      transferDate: '',
      // Toggle
      paymentConfirmation: false,
      dataTracking: [],
      // Detail Order
      orderData: [],
      items: [],
      totalItem: 0,
      subTotal: 0,
    }
  },
  created () {
    this.user = JSON.parse(window.localStorage.getItem('profileUser'));
  },
  mounted () {
    this.getDataBank();
    this.getOrder();
    this.getOrderDetail();
  },
  methods: {
    getOrder() {

        axios.get( showOrderUrl + '/' + this.$route.params.id, { headers: getHeader() } )
          .then(response => {
            console.log(response)

            if (response.status === 200) {
              this.dataOrder = response.data.data;

              this.getTracking();
            }

          })
          .catch(error => {
            if (error.response) {
              console.log(error.response)
            }
          })

    },
    getOrderDetail () {
      
      this.orderData = [];
      this.items = [];

      axios.get( showOrderUrl + '/' + this.$route.params.id, { headers: getHeader() } )
        .then(response => {
          console.log(response)

          if (response.status === 200) {

            this.orderData = response.data.data;

            for(let i=0; i<this.orderData.order_detail.length; i++){
              // alert(this.cartData.cart_detail[i].product_id);
              axios.get(catalogProductUrl + '/' + this.orderData.order_detail[i].product_id, { headers: getHeader() } )
                .then(response => {

                  let product_name = response.data.data.product_name;
                  let product_image = response.data.data.featured_image;
                  let qty = this.orderData.order_detail[i].qty;
                  let product_id = this.orderData.order_detail[i].product_id;
                  let reseller_discount = null;
                  if(this.user.role.id === 9){
                    reseller_discount = response.data.data.reseller_exclusive_price;
                  }else if(this.user.role.id === 8){
                    reseller_discount = response.data.data.reseller_pro_price;
                  }

                  if(this.orderData.order_detail[i].product_sku_id !== null){

                    axios.get(catalogProductUrl + '/' + this.orderData.order_detail[i].product_id + '/' + this.orderData.order_detail[i].product_sku_id, { headers: getHeader() } )
                      .then(response => {

                        // let options = JSON.parse(this.cartData.cart_detail[i].options);
                        // for(var opt=0; opt<options.length; opt++){
                        //   console.log(options[opt].option + 'adalah' + options[opt].value);
                        // }
                        
                        this.items.push({
                            product_id: product_id,
                            product_name: product_name,
                            product_image: product_image,
                            price: response.data.data.price - (response.data.data.price * reseller_discount / 100),
                            options: JSON.parse(this.orderData.order_detail[i].options),
                            qty: qty,
                        });

                      }).catch(error => {

                        if (error.response) {
                          console.log(error.response)
                        }

                      })

                  }else{

                    this.items.push({
                        product_id: product_id,
                        product_name: product_name,
                        product_image: product_image,
                        price: response.data.data.price - (response.data.data.price * reseller_discount / 100),
                        qty: qty,
                    });

                  }

                }).catch(error => {

                  if (error.response) {
                    console.log(error.response)
                  }

                })

            }

          }

          this.totalItem = this.orderData.order_detail.length;
          this.subTotal = this.orderData.total_amount;

        })
        .catch(error => {
          if (error.response) {
            console.log(error.response)
          }
        })

    },
    getDataBank() {

        axios.get( identityBankUrl, { headers: getHeader() } )
          .then(response => {
            console.log(response)

            if (response.status === 200) {
              this.dataBank = response.data.data;
            }

          })
          .catch(error => {
            if (error.response) {
              console.log(error.response)
            }
          })

    },
    postPaymentConfirmation() {

        let paymentConfirm = new FormData();

        paymentConfirm.set('invoice', this.dataOrder.invoice);
        paymentConfirm.set('bank_receiver', this.bankReceiver);
        paymentConfirm.set('bank_sender', this.bankSender);
        paymentConfirm.set('sender_name', this.senderName);
        paymentConfirm.set('total_transfer', this.totalTransfer);
        paymentConfirm.set('transfer_date', this.transferDate);

        axios.post( paymentConfirmationUrl, paymentConfirm, { headers: getHeader() } )
          .then(response => {
            console.log(response)

            if (response.status === 200) {
              this.getDataBank();
              this.getOrder();

              openURL("https://wa.me/6287821550989?text=Konfirmasi%20Pembayaran%0A%0ABank%20Penerima:%20" + this.bankReceiver + "%0ABank%20Pengirim:%20" + this.bankSender + "%0ANama%20Pengirim:%20" + this.senderName + "%0ATotal%20Transfer:%20" + this.totalTransfer + "%0ATanggal%20Transfer:%20" + this.transferDate + "%0A%0A*Jangan%20Lupa%20Kirim%20Bukti%20Pembayaran*");

              this.bankReceiver = '';
              this.bankSender = '';
              this.senderName = '';
              this.totalTransfer = '';
              this.transferDate = '';
            }

          })
          .catch(error => {
            if (error.response) {
              console.log(error.response)
            }
          })

        let changeStatus = new FormData();

        changeStatus.set('id', this.dataOrder.id);

        axios.post( paymentConfirmOrderUrl, changeStatus, { headers: getHeader() } )
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            if (error.response) {
              console.log(error.response)
            }
          })

    },
    getTracking () {

      if(this.dataOrder.length !== 0){

        let trackForm = new FormData();

        trackForm.set('courier', 'jne');
        trackForm.set('awb', this.dataOrder.awb);

        axios.post( trackingUrl, trackForm, { headers: getHeader() } )
          .then(response => {
            console.log(response)
            this.dataTracking = response.data;
          })
          .catch(error => {
            if (error.response) {
              console.log(error.response)
            }
          })

      }   

    },
    formatPrice(value) {
        let val = (value/1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    copyTotalTransfer: function () {
      this.$copyText(this.dataOrder.grand_total).then(function (e) {
        alert('Berhasil Disalin!')
        console.log(e)
      }, function (e) {
        alert('Gagal Disalin!')
        console.log(e)
      })
    },
    copyAccountNumber: function (accountNumber) {
      this.$copyText(accountNumber).then(function (e) {
        alert('Berhasil Disalin!')
        console.log(e)
      }, function (e) {
        alert('Gagal Disalin!')
        console.log(e)
      })
    },
  }
}
</script>

<style>
  .title-text{
    font-family: 'Open Sans';
    font-size: 13px;
    font-weight: bold;
    margin: 0;
  }
  .link-text{
    font-family: 'Open Sans';
    font-size: 13px;
    margin: 0;
  }
  .q-timeline__subtitle{
    font-size: 14px !important;
    font-weight: 600;
    text-transform: capitalize;
    color: black !important;
    letter-spacing: 0px !important;
    opacity: 1;
  }
  .q-timeline__title{
    font-size: 12px !important;
    line-height: 13px;
    color: grey !important;
    font-weight: normal;
  }
  .q-timeline__content{
    padding-bottom: 1px !important;
  }
</style>
