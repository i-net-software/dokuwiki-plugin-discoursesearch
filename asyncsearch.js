(function($){

    var discoursesearchprovider = {
        'anchor': null,
        'successHandler': null,
        'term': '',
        'config': JSINFO['plugins']['discoursesearch']
    };

    (function(_){

        _.addEntry = function() {
            var entry = this;
            var $node = $('<dl/>').addClass('search_results').appendTo( _.$root );

            var $link = $('<a/>').attr({
               'href': entry.url,
               'target': '_blank'
            }).text( entry.fancy_title ).addClass('externalurl wikilink1');

            $('<dt/>').appendTo( $node ).append( $link);
            $('<dd/>').text( entry.blurb ).appendTo( $node );
        };

        _.filter = function( array, id ) {
            var $return = null;
            $.each( array, function() {
                if ( this.topic_id && this.topic_id == id ) {
                    $return = this;
                    return false;
                }
            } );
            return $return;
        };

        _.loadResults = function( url ) {

            _.$root = $('<div/>').appendTo( _.anchor );

            $.getJSON( url + "/search/query.json?term=" + _.term ).done( function( data ) {

                if ( !data.topics ) { return; }

                $('<h3/>').text( _.config.title ).appendTo( _.$root );
                $.each( data.topics, function() {
                    var post = _.filter( data.posts, this.id );
                    this.blurb = post ? post.blurb : "";
                    this.url = url + "/t/" + this.slug + "/" + this.id;
                    _.addEntry.call( this );
                } );
                
            } ).always( function() {
                _.finishedResults();
            });
        };
        
        _.finishedResults = function() {
            if ( _.successHandler ) {
                _.successHandler.call( _.anchor );
            }
        };

    })(discoursesearchprovider);

    if ( !discoursesearchprovider.config || discoursesearchprovider.config.url.length == 0 ) {
        return;
    }

    $.asyncsearch.addProvider(function( term, successHandler ) {
        discoursesearchprovider.anchor = this;
        discoursesearchprovider.successHandler = successHandler;
        discoursesearchprovider.term = term;
        discoursesearchprovider.loadResults( discoursesearchprovider.config.url );
    });
})(jQuery);
