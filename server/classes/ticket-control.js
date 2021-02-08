const fs = require('fs');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {

        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        let data = require('../data/data.json');

        if (data.hoy === this.hoy) {
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;
        } else {
            this.reiniciarConteo();
        }

    }

    siguiente() {

        this.ultimo += 1;

        let ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.grabarArchivo();

        return `Ticket ${this.ultimo}`;
    };

    getUltimoTicket() {
        return `Ticket ${this.ultimo}`;
    };

    getUltimos4() {
        return this.ultimos4;
    };

    atenderTicket(escritorio) {
        if (this.tickets.length === 0) { // se verifica si hay tickets pendientes de atender
            return 'No hay tickets';
        }

        let numeroTicket = this.tickets[0].numero; // se extrae el numero para romper la relacion que tiene JS con que los objetos son pasados por su referencia
        this.tickets.shift(); //  se elimina la promera posicion del arreglo 

        let atenderTicket = new Ticket(numeroTicket, escritorio); // se crea el nuevo ticket que se va atender y el escritorio al que va ser atendido

        this.ultimos4.unshift(atenderTicket); // pone el ticket a atender en primero 

        if (this.ultimos4.length > 4) { //verificar que solo existan 4 elementos en pantalla
            this.ultimos4.splice(-1, 1); // borra el ultimo ticket
        }

        console.log('Ultimos 4');
        console.log(this.ultimos4);

        this.grabarArchivo();

        return atenderTicket;

    }

    reiniciarConteo() {
        this.ultimo = 0;
        this.tickets = [];
        this.ultimos4 = [];

        console.log('se ha inicializado el sistema');
        this.grabarArchivo();

    };

    grabarArchivo() {
        let jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);

    }

}

module.exports = {
    TicketControl
}