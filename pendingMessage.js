function sendPendingMessage(pendingm,io,connection,socket){
  if (pendingm.length > 0) {
      pendingm.map((e) => {
          //console.log(e);
          io.sockets.connected[socket.id].emit("updatechat", e.to, e.from, e.message);
          qry="UPDATE pen_message SET status='Y' where id="+e.id;
          connection.query(qry,function(err,rows){
              if(!err){console.log("sent "+e.id);}
              console.log(err);
          });
      });
  }
}
module.exports=sendPendingMessage;
