import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as _underscore from 'underscore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
myForm: FormGroup;

  title = 'client-side';
  public product = {};
  public list: any = [];
  submitted = false;
  public currPage = 1;
  pageSize = 2;

  public constructor(private http: HttpClient,private formBuilder: FormBuilder) { }


  public ngOnInit() {

    this.formInit();

    this.listProduct();
  }

  formInit(){
    this.myForm = this.formBuilder.group({
      ID      :      [],
      productName:   ['', Validators.required],
      productDesc:   [''],
      categoryId:    [ , [Validators.required]],
      categoryName:  ['', Validators.required],
    });
  };

  /** CALL API TO LIST THE PRODCUT */
  public async listProduct() {
    const getUrl = 'http://localhost:3000/';

    const list =  await this.http.get(getUrl).toPromise();
    this.list = list;
    _underscore.each(this.list, function(item){
      let itemIndex = _underscore.findIndex(list, item);
      item.ID = itemIndex+1;

    })
  };

  /** Call API HERE FOR SERVER SIDE */
  public async addProduct() {

    // stop here if form is invalid
    if(this.myForm.invalid) {
      return;
    }else{
      if(!this.myForm.value.ID){
        this.product = {
          "productName"  : this.myForm.value.productName,
          "productDesc"  : this.myForm.value.productDesc,
          "categoryId"   : this.myForm.value.categoryId,
          "categoryName" : this.myForm.value.categoryName,
        };
        console.log('add.product.', this.product);

        const postUrl = 'http://localhost:3000/';
        const postBody = this.product;

        await this.http.post(postUrl, postBody).toPromise();

        this.product = {};

        this.formInit();
        this.listProduct();
      }else{
        this.updateProduct();
      }
    }
  };

  public async updateProduct(){
    let indexVal = this.myForm.value.ID-1;
    this.list[indexVal] = this.myForm.value;

    this.formInit();
    this.editDeleteAPICall(this.list);
  };

  public async editProduct(item, i) {
    this.myForm.setValue({
      "ID"          : item.ID,
      "productName"  : item.productName,
      "productDesc"  : item.productDesc,
      "categoryId"   : item.categoryId,
      "categoryName" : item.categoryName,
    })
  };

  public async deleteProduct(item) {
    let tempList = [];
    _underscore.each(this.list, function(obj) {
      if(obj!=item)
        tempList.push(obj)
    })
    this.editDeleteAPICall(tempList);
  };

  public async editDeleteAPICall(prodList){
    const getUrl = 'http://localhost:3000/';
    const postBody = prodList;

    let resp = await this.http.put(getUrl, postBody).toPromise();

    if(resp){
      this.listProduct();
    }
  };

}
