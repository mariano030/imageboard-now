console.log("you are sane...");

(function () {
    new Vue({
        // el is the element in our html with access to our vue code
        el: "#main",
        data: {
            // just use "" or [] or {}
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        }, // data ends

        // this runs when our VUE instance renders - cycles
        mounted: function () {
            // db query here for images
            console.log("mounted function is runnnnning");
            //properties of DATA get added to this
            console.log("this: ", this);
            var self = this;
            axios
                .get("/images")
                .then(function (res) {
                    console.log("resonse from /images", res.data);
                    // THIS in here this will be the window object (useless for us)
                    // use self in here instead of this!
                    console.log("THIS inside axios, aka self", self);
                    self.images = res.data;
                })
                .catch(function (err) {
                    console.log("err in /images", err);
                });
        }, // mounted ends

        // functions have to be written here in methods to be available for VUE
        methods: {
            // can not use ES 6 features with VUE
            handleClick: function (e) {
                e.preventDefault();
                //console.log(this);
                var formData = new FormData(); // constructor where from?
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        console.log("resp from /POST upload", resp);
                    })
                    .catch(function (err) {
                        console.log("err in post/upload", err);
                    });
            },
            handleChange: function (e) {
                console.log / "handleChange is running!!";
                console.log("file:", e.target.files[0]);
                this.file = e.target.files[0];
            },
            // here this is still this UNLESS you have an axios in there then it's windows obj again
            myFunction: function (arg) {
                console.log("myFunction is running!!!", arg);
            },
        }, // mehtods ends here
    });
})();

// mounted method
