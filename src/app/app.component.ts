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

  public constructor(private http: HttpClient,private formBuilder: FormBuilder) { }


  public ngOnInit() {

    // this is hardcoded.
    /*this.list = [{
      productId: '1',
      productName: 'VIVO',
      categoryId: 'V10',
      categoryName: 'Mobile',
    }, {
      productId: '1',
      productName: 'VIVO',
      categoryId: 'V10',
      categoryName: 'Mobile'
    }];*/

    this.formInit();

    this.listProduct();
  }

  formInit(){
    this.myForm = this.formBuilder.group({
      index      :   [],
      productName:   ['', Validators.required],
      productDesc:   [''],
      categoryId:    [ , [Validators.required]],
      categoryName:  ['', Validators.required],
    });
  }

  /** CALL API TO LIST THE PRODCUT */
  public async listProduct() {
    const getUrl = 'http://localhost:3000/';

    const list =  await this.http.get(getUrl).toPromise();
    this.list = list;

    // this.ngOnInit();
  }

  /** Call API HERE FOR SERVER SIDE */
  public async addProduct() {

    // stop here if form is invalid
    if(this.myForm.invalid) {
      return;
    }else{
      if(!this.myForm.value.index){
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
    let indexVal = this.myForm.value.index;
    this.list[indexVal] = this.myForm.value;

    this.editDeleteAPICall(this.list);
  };

  public async editProduct(item, i) {
    this.myForm.setValue({
      index          : i,
      "productName"  : item.productName,
      "productDesc"  : item.productDesc,
      "categoryId"   : item.categoryId,
      "categoryName" : item.categoryName,
    })
  }

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
  }
}
