import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  constructor(
    private http : HttpClient,
    private nativeStorage:NativeStorage
  ) { }

  getRecentPosts(categoryId:number, page:number = 1){
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";
    return this.http.get(
      environment.wordpress_rest_api_url
      + 'community?_embed&orderby=modified&page=' + page
      + category_url)
    .subscribe(res => res);
  }
  getSpecialPosts(){
    //if we want to query posts by category
    //let category_url = categoryId? ("&categories=" + categoryId): "";
    return this.http.get(
      environment.wordpress_rest_api_url
      + 'special_item?_embed&orderby=modified');
  }

  getPopularPosts(categoryId:number, page:number = 1){
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";
    return this.http.get(
      environment.wordpress_rest_api_url
      + 'community?_embed&page=' + page
      + category_url)
    .subscribe(res => res);
  }



  getPost(postId:number){
    return this.http.get(
      environment.wordpress_rest_api_url
      + "community/" + postId)
    .subscribe(res => res);
  }

  getAuthor(author){
    return this.http.get(environment.wordpress_rest_api_url + "users/" + author)
    .subscribe((res:any) => res.json());
  }

  getUserProfile(user_id){
      return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/getUserProfile',{
        user_id:user_id
      })
  }

  getOrderStatus(order_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/getOrderStatus',{
      order_id:order_id
    })
}

  

  createPostForDayPhoto(post_title, user, day ,profile_id,kit){
    let header = new HttpHeaders();
    header.append('Authorization', 'Bearer ' + user.token);
    return this.http.post(environment.wordpress_rest_api_url + "user_images?token=" + user.token, {
      title: post_title,
      Content: '',
      excerpt: '',
      day:day,
      profile_id:profile_id,
      kit:kit
    },{ headers: header })
    .subscribe((res:any) => res.json());
  }

  getUser(){
    return this.nativeStorage.getItem('user');
  }

  setUser(user){
    console.log("good");
    //return this.nativeStorage.setItem('fancase_user', user);
  this.nativeStorage.setItem('user', user)
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );
  }

  logOut(){
    return this.nativeStorage.remove('user');
  }

  doLogin(username, password){
    return this.http.post(environment.wordpress_url + 'wp-json/jwt-auth/v1/token',{
      username: username,
      password: password
    })
  }

   doSignup(username, password,type){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/register',{
      name:'',
      email:username,
      nickname:username,
      username: username,
      password: password,
      type:type,
      jw_auth_sec:"kjE+r(J|)+-+,g4 |MQAJ.[Pciy|DyCIQux$<=(]@BH(V~oc6aR)y$$iH}@&&Z ]"
    })
  }

  updateOrderAfterLogin(username,email,phone_number,user_id,order_id){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/update_order_after_login',{
     user_id:user_id,
     name:username,
     email:email,
     phone_number:phone_number,
     order_id:order_id
   })
 }

  validateAuthToken(token){
    let header = new HttpHeaders();
    header.append('Authorization','Basic ' + token);
    return this.http.post(environment.wordpress_url + 'wp-json/jwt-auth/v1/token/validate?token=' + token,
      {}, {headers: header})
  }

  doRegister(first_name,vipeeltype,kitdate_time,vipeelprovider,zipcode,user){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/create_profile',{
     first_name:first_name,
     vipeeltype:vipeeltype,
     kitdate_time:kitdate_time,
     vipeelprovider: vipeelprovider,
     zipcode: zipcode,
     token:user.token
   })

  }

  doReset(user_login){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/retrieve_password',{
     user_login:user_login,
   })

  }

  getDirections(current_day,user){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_directions',{
       current_day:current_day,
       token:user.token
    })
  }

  getSteps(direction_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_steps',{
       direction_id:direction_id
    })
  }

  createNoTruckLabourOnly(form_data, vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/create_order_labour_only',{
       userid:form_data.userid,
       email:form_data.email,
       password:form_data.password,
       name:form_data.name,
       phone_number:form_data.phone_number,
       service_address:form_data.service_address,
       time_of_day:form_data.time_of_day,
       date_of_service:form_data.date_of_service,
       request_hours:form_data.request_hours,
       required_helpers:form_data.required_helpers,
       vendor_id:vendor_id,
    })
  }

  createPickupDelivery(photos,form_data,form_data1,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/create_order_pickup_delivery',{

      userid:form_data1.userid,
      name:form_data1.name,
      email:form_data1.email,
      phone_number:form_data1.phone_number,

      service_schedule_type:form_data1.service_schedule_type,
      date_of_service:form_data1.date_of_service,
      required_helpers:form_data1.required_helpers,
      from_service_address:form_data1.from_service_address,
      from_type:form_data1.from_type,
      outside_stairs_from:form_data1.outside_stairs_from,
      inside_stairs_from:form_data1.inside_stairs_from,
      to_service_address:form_data1.to_service_address,
      to_type:form_data1.to_type,
      outside_stairs_to:form_data1.outside_stairs_to,
      inside_stairs_to:form_data1.inside_stairs_to,

      item_image:form_data.item_image,
      item_description:form_data.item_description,
      vendor_id:vendor_id,
      photos: photos
    })
  }

  createMoveHouse(form_data1,form_data2,form_data){

    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/create_order_move_house_bk',{
      //From form_data1
      userid:form_data1.userid,
      name:form_data1.name,
      email:form_data1.email,
      password:form_data1.password,
      phone_number:form_data1.phone_number,
      from_type:form_data1.from_type,
      time_of_day:form_data1.time_of_day,
      date_of_service:form_data1.date_of_service,

      //From form_data2
      from_service_address:form_data2.from_service_address,
      from_external_stairs:form_data2.from_external_stairs,
      no_of_bedrooms:form_data2.no_of_bedrooms,
      no_of_bathrooms:form_data2.no_of_bathrooms,
      room_upstairs:form_data2.room_upstairs,
      est_sq_ft_upstairs:form_data2.est_sq_ft_upstairs,
      room_downstairs:form_data2.room_downstairs,
      est_sq_ft_downstairs:form_data2.est_sq_ft_downstairs,
      est_garage_sq_ft:form_data2.est_garage_sq_ft,
      est_attic_sq_ft:form_data2.est_attic_sq_ft,
      est_basement_sq_ft:form_data2.est_basement_sq_ft,
      est_shed_sq_ft:form_data2.est_shed_sq_ft,
      est_outside_storage_sq_ft:form_data2.est_outside_storage_sq_ft,
      outside_yard_furniture:form_data2.outside_yard_furniture,
      exercise_equipment:form_data2.exercise_equipment,
      gas_powered_equipment:form_data2.gas_powered_equipment,

      //From form_data 
      to_service_address:form_data.to_service_address,
      to_type:form_data.to_type,
      to_external_stairs:form_data.to_external_stairs,

    })
  }

  createCharitableContribution(photos,form_data,form_data1){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/create_charitable_contribution',{
       userid:form_data1.userid,
       name:form_data1.name,
       email:form_data1.email,
       password:form_data1.password,
       phone_number:form_data1.phone_number,
       pickup_address:form_data1.pickup_address,
       type_of_item:form_data1.type_of_item,
       imagepath:form_data.imagepath,
       description:form_data.description,
       photos: photos
    })
  }

  createUserProfile(form_data, deviceToken){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/create_user_profile',{
     first_name:form_data.first_name,
     email:form_data.email,
     password:form_data.password,
     phone_number: form_data.phone_number,
     signupas: form_data.signupas,
     deviceToken: deviceToken
   })
  }

  userLogin(form_data, deviceToken){
     return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_login',{
       email:form_data.email,
       password: form_data.password,
       deviceToken: deviceToken
     })
  }

  userLogoutToken(user_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_logout',{
      user_id:user_id,
    })
 }

  userLoginCreateOrder(form_data,form_data1,vendor_id,deviceToken){
     return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_login_create_order',{
       email:form_data.email,
       password: form_data.password,
       service_address:form_data1.service_address,
       date_of_service:form_data1.date_of_service,
       time_of_day:form_data1.time_of_day,
       request_hours:form_data1.request_hours,
       required_helpers:form_data1.required_helpers,
       vendor_id:vendor_id,
       deviceToken:deviceToken
     })
  }

  doRegisterCreateOrder(form_data,form_data1,vendor_id,deviceToken){
     return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_registration_create_order',{
       name:form_data.name,
       email:form_data.email,
       password: form_data.password,
       phone_number: form_data.phone_number,
       service_address:form_data1.service_address,
       date_of_service:form_data1.date_of_service,
       time_of_day:form_data1.time_of_day,
       request_hours:form_data1.request_hours,
       required_helpers:form_data1.required_helpers,
       vendor_id:vendor_id,
       deviceToken: deviceToken
     })
  }

  getCategoryTypes(){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_category_types',{
    })
  }

  getRelatedVendors(customer_address,service_date,time_of_day,service_type){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_related_vendors',{
      customer_address:customer_address,
      service_date:service_date,
      time_of_day:time_of_day,
      service_type:service_type
    })
  }

  getRelatedVendorsTruck(customer_address,service_date,time_of_day,service_type,requested_helpers,requested_hours){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_related_vendors',{
      customer_address:customer_address,
      service_date:service_date,
      time_of_day:time_of_day,
      service_type:service_type,
      requested_helpers:requested_helpers,
      requested_hours:requested_hours

    })
  }

  userLoginCreateOrderMove(photos,form_data1,form_data2,form_data3,form_data4,form_data,vendor_id,deviceToken){
     return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_login_create_order_move',{
          //From form_data1
          from_type:form_data1.from_type,
          time_of_day:form_data1.time_of_day,
          date_of_service:form_data1.date_of_service,

          // //From form_data2
          from_service_address:form_data2.from_service_address,
          outside_stairs_ext_level:form_data2.outside_stairs_ext_level,
          est_sqft_upper_level:form_data2.est_sqft_upper_level,
          est_sqft_lower_level:form_data2.est_sqft_lower_level,
          total_est_living_area:form_data2.total_est_living_area,
          total_bedrooms:form_data2.total_bedrooms,
          total_bathrooms:form_data2.total_bathrooms,
          rooms_upstairs:form_data2.rooms_upstairs,
          rooms_downstairs:form_data2.rooms_downstairs,
          garage_sqft:form_data2.garage_sqft,
          attic_sqft:form_data2.attic_sqft,
          basement_sqft:form_data2.basement_sqft,
          outside_storage_sqft:form_data2.outside_storage_sqft,
          total_est_outside_living_area:form_data2.total_est_outside_living_area,
          patio_furniture_sqft:form_data2.patio_furniture_sqft,
          exe_equipment:form_data2.exe_equipment,
          gas_equipment:form_data2.gas_equipment,

          //From form_data3
          packers_requested:form_data3.packers_requested,
          hours_requested:form_data3.hours_requested,
          to_service_address:form_data3.to_service_address,
          to_type:form_data3.to_type,
          outside_stairs_add_level:form_data3.outside_stairs_add_level,
          inside_stairs_add_level:form_data3.inside_stairs_add_level,

          //From form_data4
          video_or_pic:form_data4.video_or_pic,
          item_decscription:form_data4.item_decscription,
          
          //From form_data
          email:form_data.email,
          password: form_data.password,

          vendor_id:vendor_id,
          deviceToken: deviceToken,
          photos: photos
     })
  }

  doRegisterCreateOrderMove(photos,form_data1,form_data2,form_data3,form_data4,form_data,vendor_id,deviceToken){
     return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_registration_create_order_move',{

      //From form_data1
      from_type:form_data1.from_type,
      time_of_day:form_data1.time_of_day,
      date_of_service:form_data1.date_of_service,

      // //From form_data2
      from_service_address:form_data2.from_service_address,
      outside_stairs_ext_level:form_data2.outside_stairs_ext_level,
      est_sqft_upper_level:form_data2.est_sqft_upper_level,
      est_sqft_lower_level:form_data2.est_sqft_lower_level,
      total_est_living_area:form_data2.total_est_living_area,
      total_bedrooms:form_data2.total_bedrooms,
      total_bathrooms:form_data2.total_bathrooms,
      rooms_upstairs:form_data2.rooms_upstairs,
      rooms_downstairs:form_data2.rooms_downstairs,
      garage_sqft:form_data2.garage_sqft,
      attic_sqft:form_data2.attic_sqft,
      basement_sqft:form_data2.basement_sqft,
      outside_storage_sqft:form_data2.outside_storage_sqft,
      total_est_outside_living_area:form_data2.total_est_outside_living_area,
      patio_furniture_sqft:form_data2.patio_furniture_sqft,
      exe_equipment:form_data2.exe_equipment,
      gas_equipment:form_data2.gas_equipment,

      //From form_data3
      packers_requested:form_data3.packers_requested,
      hours_requested:form_data3.hours_requested,
      to_service_address:form_data3.to_service_address,
      to_type:form_data3.to_type,
      outside_stairs_add_level:form_data3.outside_stairs_add_level,
      inside_stairs_add_level:form_data3.inside_stairs_add_level,

      //From form_data4
      video_or_pic:form_data4.video_or_pic,
      item_decscription:form_data4.item_decscription,

      //From form_data
      name:form_data.name,
      email:form_data.email,
      password: form_data.password,
      phone_number: form_data.phone_number,

      vendor_id:vendor_id,
      deviceToken: deviceToken,
      photos: photos
     })
  }

  userLoginCreateOrderPickup(photos,form_data1,form_data2,form_data,vendor_id,deviceToken){
     return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_login_create_order_pickup_delivery',{
        service_schedule_type:form_data1.service_schedule_type,
        date_of_service:form_data1.date_of_service,
        required_helpers:form_data1.required_helpers,
        from_service_address:form_data1.from_service_address,
        from_type:form_data1.from_type,
        outside_stairs_from:form_data1.outside_stairs_from,
        inside_stairs_from:form_data1.inside_stairs_from,
        to_service_address:form_data1.to_service_address,
        to_type:form_data1.to_type,
        outside_stairs_to:form_data1.outside_stairs_to,
        inside_stairs_to:form_data1.inside_stairs_to,
          
        item_image:form_data2.item_image,
        item_description:form_data2.item_description,

        vendor_id:vendor_id,
        email:form_data.email,
        password: form_data.password,
        deviceToken: deviceToken,
        photos: photos
     })
  }

  doRegisterCreateOrderPickup(photos,form_data1,form_data2,form_data,vendor_id,deviceToken){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_registration_create_order_pickup_delivery',{
      service_schedule_type:form_data1.service_schedule_type,
      date_of_service:form_data1.date_of_service,
      required_helpers:form_data1.required_helpers,
      from_service_address:form_data1.from_service_address,
      from_type:form_data1.from_type,
      outside_stairs_from:form_data1.outside_stairs_from,
      inside_stairs_from:form_data1.inside_stairs_from,
      to_service_address:form_data1.to_service_address,
      to_type:form_data1.to_type,
      outside_stairs_to:form_data1.outside_stairs_to,
      inside_stairs_to:form_data1.inside_stairs_to,

      item_image:form_data2.item_image,
      item_description:form_data2.item_description,

      name:form_data.name,
      email:form_data.email,
      password: form_data.password,
      phone_number: form_data.phone_number,
      vendor_id:vendor_id,
      deviceToken: deviceToken,
      photos: photos
    })
  }

  createNoTruckLabourOnlyMove(photos,form_data, form_data1, form_data2, form_data3, vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/create_order_move_house',{
      //From form_data1
      userid:form_data1.userid,
      name:form_data1.name,
      email:form_data1.email,
      password:form_data1.password,
      phone_number:form_data1.phone_number,
      from_type:form_data1.from_type,
      time_of_day:form_data1.time_of_day,
      date_of_service:form_data1.date_of_service,

      //From form_data2 
      from_service_address:form_data2.from_service_address,
      outside_stairs_ext_level:form_data2.outside_stairs_ext_level,
      est_sqft_upper_level:form_data2.est_sqft_upper_level,
      est_sqft_lower_level:form_data2.est_sqft_lower_level,
      total_est_living_area:form_data2.total_est_living_area,
      total_bedrooms:form_data2.total_bedrooms,
      total_bathrooms:form_data2.total_bathrooms,
      rooms_upstairs:form_data2.rooms_upstairs,
      rooms_downstairs:form_data2.rooms_downstairs,
      garage_sqft:form_data2.garage_sqft,
      attic_sqft:form_data2.attic_sqft,
      basement_sqft:form_data2.basement_sqft,
      outside_storage_sqft:form_data2.outside_storage_sqft,
      total_est_outside_living_area:form_data2.total_est_outside_living_area,
      patio_furniture_sqft:form_data2.patio_furniture_sqft,
      exe_equipment:form_data2.exe_equipment,
      gas_equipment:form_data2.gas_equipment,

      //From form_data3
      packers_requested:form_data3.packers_requested,
      hours_requested:form_data3.hours_requested,
      to_service_address:form_data3.to_service_address,
      to_type:form_data3.to_type,
      outside_stairs_add_level:form_data3.outside_stairs_add_level,
      inside_stairs_add_level:form_data3.inside_stairs_add_level,

       //From form_data
      video_or_pic:form_data.video_or_pic,
      item_decscription:form_data.item_decscription,
      vendor_id:vendor_id,
      photos: photos
    })

  }

  vendorServiceSettingsLaborOnly(form_data,section,day,vendor_id){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_service_settiings_laboronly',{

     morning_working: form_data.morning_working,
     morning_hourlyrate: form_data.morning_hourlyrate,
     afternoon_working: form_data.afternoon_working,
     afternoon_hourlyrate: form_data.afternoon_hourlyrate,
     evening_working: form_data.evening_working,
     evening_hourlyrate: form_data.evening_hourlyrate,
     section: section,
     day: day,
     vendor_id:vendor_id
   })
  }

  getVendorServiceSettingsLaborOnly(section,day,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_service_settiings_laboronly',{
      section: section,
      day: day,
      vendor_id: vendor_id,
    })
  }

  vendorServiceSettingsLaborOnlyAllInOne(form_data,section,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_service_settiings_laboronly_all_in_one',{
      form_data: form_data,
      section: section,
      vendor_id:vendor_id
    })
   }

   getVendorServiceSettingsLaborOnlyAllInOne(section,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_service_settiings_laboronly_all_in_one',{
      section: section,
      vendor_id: vendor_id,
    })
  }

  vendorServiceSettingsPickup(form_data,section,day,vendor_id){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_service_settiings_pickup',{
     morning_working: form_data.morning_working,
     afternoon_working: form_data.afternoon_working,
     evening_working: form_data.evening_working,
     section: section,
     day: day,
     vendor_id:vendor_id
   })
  }

  getVendorServiceSettingsPickup(section,day,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_service_settiings_pickup',{
      section: section,
      day: day,
      vendor_id: vendor_id,
    })
  }


  vendorServiceSettingsPickupVehicle(form_data,section,vendor_id){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_service_settiings_pickup_vehicles',{
     six_ft_truck: form_data.six_ft_truck,
     eight_ft_truck: form_data.eight_ft_truck,
     ten_ft_truck: form_data.ten_ft_truck,
     section: section,
     vendor_id:vendor_id
   })
  }

  getVendorServiceSettingsPickupVehicle(section,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_service_settiings_pickup_vehicles',{
      section: section,
      vendor_id: vendor_id,
    })
  }

  vendorServiceSettingsPickupHelpers(form_data,section,vendor_id){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_service_settiings_pickup_helpers',{
     available_helpers: form_data.available_helpers,
     section: section,
     vendor_id:vendor_id
   })
  }

  getVendorServiceSettingsPickupHelpers(section,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_service_settiings_pickup_helpers',{
      section: section,
      vendor_id: vendor_id,
    })
  }

  vendorServiceSettingsMove(form_data,section,day,vendor_id){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_service_settiings_move',{
     morning_working: form_data.morning_working,
     morning_sq_ft_rate: form_data.morning_sq_ft_rate,
     //morning_hourlyrate: form_data.morning_hourlyrate,
     afternoon_working: form_data.afternoon_working,
     afternoon_sq_ft_rate: form_data.afternoon_sq_ft_rate,
     //afternoon_hourlyrate: form_data.afternoon_hourlyrate,
     evening_working: form_data.evening_working,
     evening_sq_ft_rate: form_data.evening_sq_ft_rate,
     //evening_hourlyrate: form_data.evening_hourlyrate,
     section: section,
     day: day,
     vendor_id:vendor_id
   })
  }

  getVendorServiceSettingsMove(section,day,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_service_settiings_move',{
      section: section,
      day: day,
      vendor_id: vendor_id,
    })
  }

  vendorServiceSettingsMoveMiles(form_data,section,vendor_id){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_service_settiings_move_miles',{
     cost_per_mile: form_data.cost_per_mile,
     inside_stairs_charges: form_data.inside_stairs_charges,
     outside_stairs_charges: form_data.outside_stairs_charges,
     section: section,
     vendor_id:vendor_id
   })
  }

  getVendorServiceSettingsMoveMiles(section,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_service_settiings_move_miles',{
      section: section,
      vendor_id: vendor_id,
    })
  }

  vendorServiceSettingsSmallMove(form_data,section,vendor_id){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_service_settiings_small_move',{
     outside_from_address: form_data.outside_from_address,
     outside_to_address: form_data.outside_to_address,
     inside_to_address: form_data.inside_to_address,
     inside_from_address: form_data.inside_from_address,
     trailer_amival_cost: form_data.trailer_amival_cost,
     trailer_per_hour: form_data.trailer_per_hour,
     trailer_per_mile: form_data.trailer_per_mile,
     van_amival_cost: form_data.van_amival_cost,
     van_per_hour: form_data.van_per_hour,
     van_per_mile: form_data.van_per_mile,
     small_truck_amival_cost: form_data.small_truck_amival_cost,
     small_truck_per_hour: form_data.small_truck_per_hour,
     small_truck_per_mile: form_data.small_truck_per_mile,
     large_truck_amival_cost: form_data.large_truck_amival_cost,
     large_truck_per_hour: form_data.large_truck_per_hour,
     large_truck_per_mile: form_data.large_truck_per_mile,
     section: section,
     vendor_id: vendor_id
   })
  }

  getVendorServiceSettingsSmallMove(section,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_service_settiings_small_move',{
      section: section,
      vendor_id: vendor_id,
    })
  }

  vendorServiceSettingsMoveSpecialty(form_data,section,vendor_id){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_service_settiings_move_specialty',{
     specialty_move_pool_table: form_data.specialty_move_pool_table,
     specialty_move_piano: form_data.specialty_move_piano,
     specialty_move_hot_tub: form_data.specialty_move_hot_tub,
     specialty_move_small_safe: form_data.specialty_move_small_safe,
     specialty_move_large_safe: form_data.specialty_move_large_safe,
     section: section,
     vendor_id:vendor_id
   })
  }

  vendorServiceSettingsFullMove(form_data,section,vendor_id){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_service_settiings_full_move',{
     upper_level_cost: form_data.upper_level_cost,
     lower_level_cost: form_data.lower_level_cost,
     from_address_cost: form_data.from_address_cost,
     to_address_cost: form_data.to_address_cost,

     garage_cost: form_data.garage_cost,
     attic_cost: form_data.attic_cost,
     shed_outside_storage_cost: form_data.shed_outside_storage_cost,
     basement_cost: form_data.basement_cost,

     outside_patio_furniture: form_data.outside_patio_furniture,
     exercise_equipment: form_data.exercise_equipment,
     gas_powered_equipment_cost: form_data.gas_powered_equipment_cost,
     labor_hour_cost: form_data.labor_hour_cost,

     section: section,
     vendor_id:vendor_id
   })
  }

  getVendorServiceSettingsMoveSpecialty(section,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_service_settiings_move_specialty',{
      section: section,
      vendor_id: vendor_id,
    })
  }

  getVendorServiceSettingsullMove(section,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_service_settiings_full_move',{
      section: section,
      vendor_id: vendor_id,
    })
  }

  vendorServiceSettings(form_data,vendor_id){  
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_service_settiings',{
     service_provider: form_data.service_provider,
     provider_description: form_data.provider_description,
     address: form_data.address,
     mileage_radius: form_data.mileage_radius,
     same_day_service: form_data.same_day_service,
     vendor_id: vendor_id,
     imagepath:form_data.imagepath
   })
  }

  getVendorServiceSettings(vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_service_settiings',{
      vendor_id: vendor_id,
    })
  }

  vendorAccountSettings(form_data,vendor_id){
   return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_account_settings',{
     firstname: form_data.firstname,
     lastname: form_data.lastname,
     mailing_address: form_data.mailing_address,
     phone: form_data.phone,
     email: form_data.email,
     routing_number: form_data.routing_number,
     account_number: form_data.account_number,
     vendor_id: vendor_id,
     ip_pid:form_data.ip_pid,
     ip_irs:form_data.ip_irs,
     ip_ins:form_data.ip_ins,
     ip_oth:form_data.ip_oth
   })
  }

  getVendorAccountSettings(vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_account_settiings',{
      vendor_id: vendor_id,
    })
  }

  userLoginCreateOrderDonation(photos,form_data1,form_data2,form_data,deviceToken){
     return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_login_create_order_donation',{
        email:form_data.email,
        password: form_data.password,
        pickup_address:form_data1.pickup_address,
        type_of_item:form_data1.type_of_item,
        imagepath:form_data2.imagepath,
        description:form_data2.description,
        deviceToken:deviceToken,
        photos: photos
     })
  }

  userRegisterCreateOrderDonation(photos,form_data1,form_data2,form_data,deviceToken){
     return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_register_create_order_donation',{
        name:form_data.name,
        email:form_data.email,
        password: form_data.password,
        phone_number: form_data.phone_number,
        pickup_address:form_data1.pickup_address,
        type_of_item:form_data1.type_of_item,
        imagepath:form_data2.imagepath,
        description:form_data2.description,
        deviceToken: deviceToken,
        photos: photos
     })
  }

  VendorRegistration(form_data){
     return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_registration',{
        //username:form_data.username,
        email:form_data.email,
        firstname:form_data.firstname,
        lastname:form_data.lastname,
        password:form_data.password,
        s_laboronly:form_data.s_laboronly,
        s_pickupdelivey:form_data.s_pickupdelivey,
        s_donation:form_data.s_donation,
        s_smallmove:form_data.s_smallmove,
        s_fullmove:form_data.s_fullmove,
        service_provider: form_data.service_provider,
        provider_description: form_data.provider_description,
        address: form_data.address,
        mileage_radius: form_data.mileage_radius,
        same_day_service: form_data.same_day_service
     })
  }

  activateServices(form_data,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_activate_services',{
      s_laboronly:form_data.s_laboronly,
      s_pickupdelivey:form_data.s_pickupdelivey,
      s_smallmove:form_data.s_smallmove,
      s_fullmove:form_data.s_fullmove,
      vendor_id: vendor_id
    })
  }

  getVendorActivatedServices(vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_activated_services',{
      vendor_id: vendor_id
    })
  }

  getResources(){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_resources',{
    })
  }

  getVendorOrders(vendor_id, page_no){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_orders',{
      vendor_id: vendor_id,
      page_no: page_no
    })
  }

  getArchivedOrders(vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_archived_orders',{
      vendor_id: vendor_id
    })
  }

  getCustomerOrders(customer_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_customer_orders',{
      vendor_id: customer_id
    })
  }

  setOrderStatusByVendor(vendor_id,order_id,order_status){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/set_order_status_by_vendor',{
      vendor_id: vendor_id,
      order_id: order_id,
      order_status: order_status
    })
  }

  getOrderDetails(order_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_order_details',{
      order_id: order_id
    })
  }

  getRelatedVendorsSmallMove(customer_address,service_date,time_of_day,service_type,requested_helpers,requested_hours,to_service_address,from_outside_stairs,from_inside_stairs,to_outside_stairs,to_inside_stairs){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_related_vendors',{
      customer_address:customer_address,
      service_date:service_date,
      time_of_day:time_of_day,
      service_type:service_type,
      requested_helpers:requested_helpers,
      requested_hours:requested_hours,
      to_service_address:to_service_address,
      from_outside_stairs:from_outside_stairs,
      from_inside_stairs:from_inside_stairs,
      to_outside_stairs:to_outside_stairs,
      to_inside_stairs:to_inside_stairs
    })
  }

  getRelatedVendorsFullMove(customer_address,service_date,time_of_day,service_type, from_address, outside_stairs_ext_level, est_sqft_upper_level, est_sqft_lower_level, garage_sqft, attic_sqft, basement_sqft, outside_storage_sqft, patio_furniture_sqft, exe_equipment, gas_equipment, packers_requested, to_address, outside_stairs_add_level, hours_requested){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_related_vendors',{
      customer_address: customer_address,
      service_date: service_date,
      time_of_day: time_of_day,
      service_type: service_type,
      from_address: from_address,
      outside_stairs_ext_level: outside_stairs_ext_level,
      est_sqft_upper_level: est_sqft_upper_level,
      est_sqft_lower_level: est_sqft_lower_level,
      garage_sqft: garage_sqft,
      attic_sqft: attic_sqft,
      basement_sqft: basement_sqft,
      outside_storage_sqft: outside_storage_sqft,
      patio_furniture_sqft: patio_furniture_sqft,
      exe_equipment: exe_equipment,
      gas_equipment: gas_equipment,
      packers_requested: packers_requested,
      to_address: to_address,
      outside_stairs_add_level: outside_stairs_add_level,
      hours_requested: hours_requested
    })
  }

  createSmallMove(photos, form_data, form_data1, vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/create_order_small_move',{
       //From form_data1
       userid: form_data1.userid,
       name: form_data1.name,
       email: form_data1.email,
       password: form_data1.password,
       phone_number: form_data1.phone_number,
       date_of_service: form_data1.date_of_service,
       from_inside_stairs: form_data1.from_inside_stairs,
       from_outside_stairs: form_data1.from_outside_stairs,
       from_service_address: form_data1.from_service_address,
      //  request_hours: form_data1.request_hours,
      //  required_helpers: form_data1.required_helpers,
       time_of_day: form_data1.time_of_day,
      //  to_inside_stairs: form_data1.to_inside_stairs,
      //  to_outside_stairs: form_data1.to_outside_stairs,
      //  to_service_address: form_data1.to_service_address,
       //truck_type: form_data1.truck_type,

       //From form_data
       mediapath: form_data.mediapath,
       description: form_data.description,
       vendor_id:vendor_id,
       photos: photos
    })

  }

  userLoginCreateSmallMove(photos,form_data,form_data1,form_data2,vendor_id,deviceToken){
     return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_login_create_small_move',{
       email:form_data.email,
       password: form_data.password,
       //From form_data1
       date_of_service: form_data1.date_of_service,
       from_inside_stairs: form_data1.from_inside_stairs,
       from_outside_stairs: form_data1.from_outside_stairs,
       from_service_address: form_data1.from_service_address,
      //  request_hours: form_data1.request_hours,
      //  required_helpers: form_data1.required_helpers,
       time_of_day: form_data1.time_of_day,
      //  to_inside_stairs: form_data1.to_inside_stairs,
      //  to_outside_stairs: form_data1.to_outside_stairs,
      //  to_service_address: form_data1.to_service_address,
      //  truck_type: form_data1.truck_type,
       //From form_data2
       mediapath: form_data2.mediapath,
       description: form_data2.description,
       vendor_id:vendor_id,
       deviceToken: deviceToken,
       photos: photos
     })
  }

  doRegisterCreateSmallMove(photos,form_data,form_data1,form_data2,vendor_id,deviceToken){
     return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/user_registration_create_small_move',{
       name:form_data.name,
       email:form_data.email,
       password: form_data.password,
       phone_number: form_data.phone_number,
       //From form_data1
       date_of_service: form_data1.date_of_service,
       from_inside_stairs: form_data1.from_inside_stairs,
       from_outside_stairs: form_data1.from_outside_stairs,
       from_service_address: form_data1.from_service_address,
      //  request_hours: form_data1.request_hours,
      //  required_helpers: form_data1.required_helpers,
       time_of_day: form_data1.time_of_day,
      //  to_inside_stairs: form_data1.to_inside_stairs,
      //  to_outside_stairs: form_data1.to_outside_stairs,
      //  to_service_address: form_data1.to_service_address,
      //  truck_type: form_data1.truck_type,
       //From form_data2
       mediapath: form_data2.mediapath,
       description: form_data2.description,
       vendor_id:vendor_id,
       deviceToken: deviceToken,
       photos: photos
     })
  }

  vendorPickupNotification(form_data,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/vendor_pickup_settings',{
      pickup_notification:form_data.pickup_notification,
      vendor_id: vendor_id
    })
  }

  getVendorPickupNotification(vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_pickup_settings',{
      vendor_id: vendor_id
    })
  }

  bidAmount(vendor_id,orderid,bid_amount,description,product_type){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/bid_amount',{
      vendor_id: vendor_id,
      order_id: orderid,
      bid_amount: bid_amount,
      description: description,
      product_type: product_type
    })
  }

  getVendorBids(order_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_bids',{
      order_id: order_id
    })
  }

  approveBid(status,role,user_id,order_id,vendor_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/bid_approval',{
      status: status,
      role: role,
      user_id: user_id,
      order_id: order_id,
      vendor_id: vendor_id
    })
  }

  updateMessage(order_id, user_id, chat_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/update_message',{
      order_id: order_id,
      user_id: user_id,
      chat_id: chat_id
    })
  }

  readMessage(order_id, user_id, chat_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/read_message',{
      order_id: order_id,
      user_id: user_id,
      chat_id: chat_id
    })
  }
  
  getOrdersChat(user_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_orders_chat',{
      vendor_id: user_id
    })
  }

  getVendorDetails(vendor_id, order_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_details',{
      vendor_id: vendor_id,
      order_id: order_id
    })
  }

  

  reportProblemEmail(form_data,userId,role,order_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/report_problem_email',{
      message: form_data.message,
      userId: userId,
      role: role,
      order_id: order_id
    })
  }

  paymentNotification(order_id,customer_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/payment_notification',{
      order_id: order_id,
      customer_id: customer_id
    })
  }

  contactHaulEmail(form_data){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/contact_haul_email',{
      message: form_data.message,
      sender_name: form_data.sender_name,
      subject: form_data.subject,
      contact_number: form_data.contact_number,
      sender_email: form_data.sender_email
    })
  }

  // Get Pages  

  getFAQ(){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_faq',{
    })
  }

  
  getVendorCoverage(){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_coverage',{
    })
  }

  getFAQVendor(){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_faq_vendor',{
    })
  }

  getVAgreements(){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_vendor_agreements',{
    })
  }

  getCAgreements(){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_customer_agreements',{
    })
  }

  getAboutUs(){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_about_us',{
    })
  }

  getAboutUsVendor(){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_about_us_vendor',{
    })
  }

  getPrivacyPolicy(){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/get_privacy_policy',{
    })
  }

  setOrderToArchive(order_ids, u_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/set_order_to_archive',{
      order_ids: order_ids,
      user_id: u_id
    })
  }

  setOrderToUnArchive(order_ids, u_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/set_order_to_unarchive',{
      order_ids: order_ids,
      user_id: u_id
    })
  }

  setRating(order_id, customer_id, rating, comment){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/setRating',{
      order_id: order_id,
      customer_id: customer_id,
      rating: rating,
      comment: comment
    })
  }

  checkRating(order_id, customer_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/checkRating',{
      order_id: order_id,
      customer_id: customer_id,
    })
  }

  getFeedack(user_id, page_no){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/getFeedack',{
      user_id: user_id,
      page_no: page_no
    })
  }

  

  changePassword(password,user_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/change_password',{
      password: password,
      user_id: user_id
    })
  }

  updateProfile(userName,userPhone,user_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/update_customer_profile',{
      userName: userName,
      userPhone: userPhone,
      user_id: user_id
    })
  }

  send_chat_notification(order_id, user_role, chat_id, cust_id, ven_id){
    return this.http.post(environment.wordpress_url + 'wp-json/mobileapi/v1/send_chat_notification',{
      order_id: order_id,
      user_role: user_role,
      chat_id: chat_id,
      cust_id: cust_id,
      ven_id: ven_id
    })
  }

  updateToken(userId, deviceID, deviceData, status) {
    if(status=='logout'){
      // this.logOut();
    }
   return this.http.post(environment.wordpress_url + "wp-json/mobileapi/v1/updateDeviceToken", {
       userid: userId,
       deviceID: deviceID,
       deviceData: deviceData,
       status: status
   });
  }

}
