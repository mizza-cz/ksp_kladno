// jQuery Ajax for feed Instagram Graph API
if ($('#instagram-feed1').length != 0) {
   $.ajax({
       url: '/instagram.json',
       type: 'GET',
       success: function (response) {
           for (var x in response.data) {
               var link = response.data[x]['permalink'],
                   caption = response.data[x]['caption'],
                   image = response.data[x]['media_url'],
                   image_video = response.data[x]['thumbnail_url'],
                   html = '';
               if (response.data[x]['media_type'] == 'VIDEO') {
                   html += '<div class="instagram_new">';
                   html += '<a class="insta-link" href="' + link + '" rel="noopener" target="_blank">';
                   html += '<img src="' + image_video + '" loading="lazy" alt="' + caption + '" class="insta-image" />';
                   html += '</a>';
                   html += '</div>';
               } else {
                   html += '<div class="instagram_new">';
                   html += '<a class="insta-link" href="' + link + '" rel="noopener" target="_blank">';
                   html += '<img src="' + image + '" loading="lazy" alt="' + caption + '" class="insta-image" />';
                   html += '</a>';
                   html += '</div>';
               }
               $('#instagram-feed1').append(html);
               console.log(response.data[x]['call_count']);
           }
       },
       error: function (data) {
           var html = '<div class="class-no-data">No Images Found</div>';
           $('#instagram-feed1').append(html);
       }
   });
}