$(document).ready(async function () {
    "use strict";

    const userId = $("#user").val();
    let user = null;
    try {
        user = await request(`/api/v1/users/${userId}`);
        
        if(user.profileImage==="") user.profileImage="/images/user_profile.webp";
        $("#profilePicPreview").attr('src', user.profileImage);
        $("#firstName").val(user.firstName);
        $("#lastName").val(user.lastName);
        $("#username").val(user.username);
        $("#email").val(user.email);
        // $("#countryCode").val(user.);
        $("#phoneNumber").val(user.phone);
        $("#address").val(user.address);
    } catch (error) {
        console.log(error);
        showAlert('warn','Could not load profile. Refresh Page!!!');
    }

    $("#profilePicUploadBtn").click(function (e) {
        e.preventDefault();
        document.getElementById('profilePicUpload').click();
    });

    $('#profilePicUpload').on('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#profilePicPreview').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });



    $('#profileForm').on('submit', async function (e) {
        e.preventDefault();

        const profileData = {
            username: $('#username').val(),
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            phone: $('#phoneNumber').val(),
            address: $("#address").val()
        };

        try {
            let response = await request(`/api/v1/users/${userId}`,'POST',profileData);
            showAlert('success','Your profile has been updated sucessfully!!');
            console.log('success');
        } catch (error) {
            console.log(error);
            showAlert('warn','Could not update your profile now. Try again later!!');
        }
        // console.log('Profile Updated:', profileData);
        // alert('Profile saved successfully.');
    });


    $("#savePicBtn").click(async function (e) {
        e.preventDefault();

        let formData = new FormData();
        let fileInput = $('#profilePicUpload')[0].files[0];
        if (!fileInput) {
            showAlert('warn',"Please select an image upload.");
            return false;
        }
        formData.append('profilePic', fileInput);


        uploadRequest(`/api/v1/uploads/profile/${userId}`, formData)
            .then(response => {
                console.log(response);
                showAlert('success','Profile Picture Updated');
                // Response => Object { message: "Image uploaded successfully", fileName: "bookCover-1725209079725-thebook.png" }
            }).catch(error => {
                console.log(error)
                showAlert('warn',"Error updating profile picture");
            })

        return false;
    });

    $("#authForm").submit(function (e) { 
        e.preventDefault();
        showAlert('warn','Cannot update password at the moment!!');
    });
});